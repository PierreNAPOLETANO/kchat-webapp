// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Pusher, {Channel} from 'pusher-js';

import {SocketEvents} from 'utils/constants';

const MAX_WEBSOCKET_FAILS = 7;
const MIN_WEBSOCKET_RETRY_TIME = 3000; // 3 sec
const MAX_WEBSOCKET_RETRY_TIME = 300000; // 5 mins

export default class WebSocketClient {
    private conn: Pusher | null;
    private channel: Channel | null;
    private connectionUrl: string | null;

    // responseSequence is the number to track a response sent
    // via the websocket. A response will always have the same sequence number
    // as the request.
    private responseSequence: number;

    // serverSequence is the incrementing sequence number from the
    // server-sent event stream.
    private serverSequence: number;
    private connectFailCount: number;
    private eventCallback: ((msg: any) => void) | null;
    private responseCallbacks: { [x: number]: ((msg: any) => void) };
    private firstConnectCallback: (() => void) | null;
    private reconnectCallback: (() => void) | null;
    private missedEventCallback: (() => void) | null;
    private errorCallback: ((event: Event) => void) | null;
    private closeCallback: ((connectFailCount: number) => void) | null;
    private connectionId: string | null;

    constructor() {
        this.conn = null;
        this.channel = null;
        this.connectionUrl = null;
        this.responseSequence = 1;
        this.serverSequence = 0;
        this.connectFailCount = 0;
        this.eventCallback = null;
        this.responseCallbacks = {};
        this.firstConnectCallback = null;
        this.reconnectCallback = null;
        this.missedEventCallback = null;
        this.errorCallback = null;
        this.closeCallback = null;
        this.connectionId = '';
    }

    // on connect, only send auth cookie and blank state.
    // on hello, get the connectionID and store it.
    // on reconnect, send cookie, connectionID, sequence number.
    initialize(connectionUrl = this.connectionUrl, token?: string) {
        if (this.conn) {
            return;
        }

        if (connectionUrl == null) {
            console.log('websocket must have connection url'); //eslint-disable-line no-console
            return;
        }

        if (this.connectFailCount === 0) {
            console.log('websocket connecting to ' + connectionUrl); //eslint-disable-line no-console
        }

        Pusher.Runtime.createXHR = function () {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            return xhr;
        };

        // Add connection id, and last_sequence_number to the query param.
        // We cannot use a cookie because it will bleed across tabs.
        // We cannot also send it as part of the auth_challenge, because the session cookie is already sent with the request.
        this.conn = new Pusher('app-key', {
            wsHost: 'websocket.kslack.infomaniak.com',
            httpHost: 'websocket.kslack.infomaniak.com',
            authEndpoint: 'https://websocket.kslack.infomaniak.com/broadcasting/auth',
            //wsHost: 'local.devd281.dev.infomaniak.ch',
            //httpHost: 'local.devd281.dev.infomaniak.ch',
            //authEndpoint: 'http://local.devd281.dev.infomaniak.ch/broadcasting/auth',
            wsPort: 443,
            wssPort: 443,
            httpPort: 443,
            httpsPort: 443,
            forceTLS: true,
            enabledTransports: ['ws', 'wss'],
        });

        this.connectionUrl = connectionUrl;
        this.channel = this.conn.subscribe('private-workspace.infomaniak');
        //this.channel = this.conn.subscribe('test.' + this.connectionId);
        //this.channel = this.conn.subscribe('test.12');

        this.conn.connection.bind('connected', () => {
            if (token) {
                this.sendMessage('authentication_challenge', {token});
            }

            if (this.connectFailCount > 0) {
                console.log('websocket re-established connection'); //eslint-disable-line no-console
                if (this.reconnectCallback) {
                    this.reconnectCallback();
                }
            } else if (this.firstConnectCallback) {
                this.firstConnectCallback();
            }

            this.connectFailCount = 0;
        });

        this.conn.connection.bind('disconnected', () => {
            this.conn = null;
            this.responseSequence = 1;

            if (this.connectFailCount === 0) {
                console.log('websocket closed'); //eslint-disable-line no-console
            }

            this.connectFailCount++;

            if (this.closeCallback) {
                this.closeCallback(this.connectFailCount);
            }

            let retryTime = MIN_WEBSOCKET_RETRY_TIME;

            // If we've failed a bunch of connections then start backing off
            if (this.connectFailCount > MAX_WEBSOCKET_FAILS) {
                retryTime = MIN_WEBSOCKET_RETRY_TIME * this.connectFailCount * this.connectFailCount;
                if (retryTime > MAX_WEBSOCKET_RETRY_TIME) {
                    retryTime = MAX_WEBSOCKET_RETRY_TIME;
                }
            }

            setTimeout(
                () => {
                    this.initialize(connectionUrl, token);
                },
                retryTime,
            );
        });

        this.conn.connection.bind('error', (evt) => {
            if (this.connectFailCount <= 1) {
                console.log('websocket error'); //eslint-disable-line no-console
                console.log(evt); //eslint-disable-line no-console
            }

            if (this.errorCallback) {
                this.errorCallback(evt);
            }
        });

        this.channel.bind_global((evt, data) => {
            console.error(`The event ${evt} was triggered with data`);
            console.error(data);

            if (!data) {
                return;
            }

            if (data.seq_reply) {
                // This indicates a reply to a websocket request.
                // We ignore sequence number validation of message responses
                // and only focus on the purely server side event stream.
                if (data.error) {
                    console.log(data); //eslint-disable-line no-console
                }

                if (this.responseCallbacks[data.seq_reply]) {
                    this.responseCallbacks[data.seq_reply](data);
                    Reflect.deleteProperty(this.responseCallbacks, data.seq_reply);
                }
            } else if (this.eventCallback) {
                this.serverSequence = data.seq + 1;
                this.eventCallback({event: evt, data});
            }
        });
    }

    setEventCallback(callback: (msg: any) => void) {
        this.eventCallback = callback;
    }

    setFirstConnectCallback(callback: () => void) {
        this.firstConnectCallback = callback;
    }

    setReconnectCallback(callback: () => void) {
        this.reconnectCallback = callback;
    }

    setMissedEventCallback(callback: () => void) {
        this.missedEventCallback = callback;
    }

    setErrorCallback(callback: (event: Event) => void) {
        this.errorCallback = callback;
    }

    setCloseCallback(callback: (connectFailCount: number) => void) {
        this.closeCallback = callback;
    }

    close() {
        this.connectFailCount = 0;
        this.responseSequence = 1;
        if (this.conn && this.conn.connection.state === 'connected') {
            this.conn.connection.bind('disconnected', () => {
            });
            this.conn.disconnect();
            this.conn = null;
            console.log('websocket closed'); //eslint-disable-line no-console
        }
    }

    sendMessage(action: string, data: any, responseCallback?: () => void) {
        const msg = {
            action,
            seq: this.responseSequence++,
            data,
        };

        if (responseCallback) {
            this.responseCallbacks[msg.seq] = responseCallback;
        }

        if (this.conn && this.conn.connection.state === 'connected') {
            this.channel?.trigger(action, msg);
        } else if (!this.conn || this.conn.connection.state === 'disconnected') {
            this.conn = null;
            this.initialize();
        }
    }

    userTyping(channelId: string, parentId: string, callback?: () => void) {
        const data = {
            channel_id: channelId,
            parent_id: parentId,
        };
        this.sendMessage('client-user_typing', data, callback);
    }

    userUpdateActiveStatus(userIsActive: boolean, manual: boolean, callback?: () => void) {
        const data = {
            user_is_active: userIsActive,
            manual,
        };
        this.sendMessage('client-user_update_active_status', data, callback);
    }

    getStatuses(callback?: () => void) {
        this.sendMessage('client-get_statuses', null, callback);
    }

    getStatusesByIds(userIds: string[], callback?: () => void) {
        const data = {
            user_ids: userIds,
        };
        this.sendMessage('client-get_statuses_by_ids', data, callback);
    }
}
