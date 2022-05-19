// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Dispatch} from 'redux';

import {DispatchFunc, GenericAction} from 'mattermost-redux/types/actions';
import Constants, {ActionTypes} from 'utils/constants';
import {connectedChannelID, voiceConnectedChannels, voiceConnectedUsers} from 'selectors/calls';
import {getProfilesByIds} from 'mattermost-redux/actions/users';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/common';
import {Client4} from 'mattermost-redux/client';
import {isDesktopApp} from 'utils/user_agent';
import { getChannel, makeGetChannel } from 'mattermost-redux/selectors/entities/channels';
import { getUser } from 'mattermost-redux/selectors/entities/users';

// import {Client4} from 'mattermost-redux/client';

export const showExpandedView = () => (dispatch: Dispatch<GenericAction>) => {
    dispatch({
        type: ActionTypes.SHOW_EXPANDED_VIEW,
    });
};

export const hideExpandedView = () => (dispatch: Dispatch<GenericAction>) => {
    dispatch({
        type: ActionTypes.HIDE_EXPANDED_VIEW,
    });
};

export const showSwitchCallModal = (targetID?: string) => (dispatch: Dispatch<GenericAction>) => {
    dispatch({
        type: ActionTypes.SHOW_SWITCH_CALL_MODAL,
        data: {
            targetID,
        },
    });
};

export const hideSwitchCallModal = () => (dispatch: Dispatch<GenericAction>) => {
    dispatch({
        type: ActionTypes.HIDE_SWITCH_CALL_MODAL,
    });
};

export function leaveCallInChannel(channelID: string, dialingID: string) {
    return async (dispatch: DispatchFunc, getState) => {
        Client4.leaveMeet(dialingID);
        dispatch({
            type: ActionTypes.VOICE_CHANNEL_USER_DISCONNECTED,
            data: {
                channelID,
                userID: getCurrentUserId(getState()),
                currentUserID: getCurrentUserId(getState()),
                callID: dialingID,
            },
        });
    };
}

export function startOrJoinCallInChannel(channelID: string, dialingID?: string) {
    return async (dispatch: DispatchFunc, getState) => {
        const state = getState();
        const getChannel = makeGetChannel();
        const currentChannel = getChannel(state, {id: channelID});
        const channelName = currentChannel.display_name.length > 30 ? `${currentChannel.display_name.substring(0, 30)}...` : currentChannel.display_name;
        const channels = voiceConnectedChannels(state);
        let data;
        if (!connectedChannelID(getState()) && !channels[channelID]) {
            data = await Client4.startMeet(channelID);
            dispatch({
                type: ActionTypes.VOICE_CHANNEL_ENABLE,
            });

            await dispatch({
                type: ActionTypes.VOICE_CHANNEL_USER_CONNECTED,
                data: {
                    channelID,
                    userID: getCurrentUserId(getState()),
                    currentUserID: getCurrentUserId(getState()),
                    url: data.url,
                    id: data.id,
                },
            });
            try {
                const users = voiceConnectedUsers(state);
                if (users && users.length > 0) {
                    dispatch({
                        type: ActionTypes.VOICE_CHANNEL_PROFILES_CONNECTED,
                        data: {
                            profiles: await dispatch(getProfilesByIds(users)),
                            channelID,
                        },
                    });
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err);
                return;
            }
        } else if (!connectedChannelID(getState())) {
            data = {id: Object.keys(channels[dialingID || channelID])[0]};
            await Client4.acceptIncomingMeetCall(data.id);
            dispatch({
                type: ActionTypes.VOICE_CHANNEL_ENABLE,
            });

            await dispatch({
                type: ActionTypes.VOICE_CHANNEL_USER_CONNECTED,
                data: {
                    channelID,
                    userID: getCurrentUserId(getState()),
                    currentUserID: getCurrentUserId(getState()),
                    url: '',
                    id: data.id,
                },
            });
            try {
                const users = voiceConnectedUsers(state);
                if (users && users.length > 0) {
                    dispatch({
                        type: ActionTypes.VOICE_CHANNEL_PROFILES_CONNECTED,
                        data: {
                            profiles: await dispatch(getProfilesByIds(users)),
                            channelID,
                        },
                    });
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err);
                return;
            }
        }

        if (!isDesktopApp()) {
            window.onCloseJitsi = (window) => {
                window.close();
                Client4.leaveMeet(data.id);
                dispatch({
                    type: ActionTypes.VOICE_CHANNEL_USER_DISCONNECTED,
                    data: {
                        channelID,
                        callID: data.id,
                        userID: getCurrentUserId(getState()),
                        currentUserID: getCurrentUserId(getState()),
                    },
                });
            };
            window.onParticipantJoined = (msg: {id: string; displayName: string}) => {
                // console.log(msg);
                dispatch({
                    type: ActionTypes.VOICE_CHANNEL_PROFILE_CONNECTED,
                    data: {
                        channelID: data.id,
                        profile: msg,
                    },
                });
            };

            const windowFeatures = 'width=1100,height=800,left=200,top=200,resizable=yes';

            window.callWindow = window.open(`/static/call.html?channelID=${data.id}&channelName=${channelName !== '' ? channelName : data.id}`, 'ExpandedView', windowFeatures);
            window.callWindow.onbeforeunload = () => {
                Client4.leaveMeet(data.id);
                dispatch({
                    type: ActionTypes.VOICE_CHANNEL_USER_DISCONNECTED,
                    data: {
                        channelID,
                        userID: getCurrentUserId(getState()),
                        currentUserID: getCurrentUserId(getState()),
                        callID: data.id,
                    },
                });
            };
        }
    };
}
