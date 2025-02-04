// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Dispatch} from 'redux';

import {ActionFunc, DispatchFunc, GenericAction} from 'mattermost-redux/types/actions';
import {ActionTypes} from 'utils/constants';
import {
    connectedCallID,
    connectedCallUrl,
    connectedChannelID,
    voiceConnectedChannels,

    // voiceConnectedUsers,
} from 'selectors/calls';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/common';
import {Client4} from 'mattermost-redux/client';
import {GlobalState} from 'types/store';

// import {makeGetChannel} from 'mattermost-redux/selectors/entities/channels';
// import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

// import {getProfilesByIds} from 'mattermost-redux/actions/users';
// import {isDesktopApp} from 'utils/user_agent';
// import {getTeammateNameDisplaySetting} from 'mattermost-redux/selectors/entities/preferences';
// import {displayUsername} from 'mattermost-redux/utils/user_utils';
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

export function startOrJoinCallInChannel(channelID: string /**, dialingID?: string*/): ActionFunc {
    return async (dispatch: DispatchFunc, getState: () => GlobalState) => {
        const state = getState();
        const channels = voiceConnectedChannels(state);

        // const getChannel = makeGetChannel();
        // const currentChannel = getChannel(state, {id: channelID});
        // const currentUser = getCurrentUser(getState());
        // const channelName = currentChannel.display_name.length > 30 ? `${currentChannel.display_name.substring(0, 30)}...` : currentChannel.display_name;

        let data;
        if (!connectedChannelID(getState()) && !channels[channelID]) {
            data = await Client4.startMeet(channelID);
            dispatch({
                type: ActionTypes.VOICE_CHANNEL_ENABLE,
            });

            if (data && data.url) {
                const kmeetUrl = new URL(data.url);
                window.open(kmeetUrl.href, '_blank', 'noopener');
            }

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

            // actions > old-calls #1
        } else if (connectedCallUrl(state) !== null) {
            const kmeetUrl = new URL(connectedCallUrl(state));
            window.open(kmeetUrl.href, '_blank', 'noopener');
        }

        // actions > old-calls #2
    };
}

export function updateAudioStatus(dialingID: string, muted = false) {
    return async (dispatch: DispatchFunc, getState: () => GlobalState) => {
        dispatch({
            type: muted ? ActionTypes.VOICE_CHANNEL_USER_MUTED : ActionTypes.VOICE_CHANNEL_USER_UNMUTED,
            data: {
                userID: getCurrentUserId(getState()),
                callID: connectedCallID(getState()),
            },
        });
    };
}

export function updateCameraStatus(dialingID: string, muted = false) {
    return async (dispatch: DispatchFunc, getState: () => GlobalState) => {
        dispatch({
            type: muted ? ActionTypes.VOICE_CHANNEL_USER_VIDEO_OFF : ActionTypes.VOICE_CHANNEL_USER_VIDEO_ON,
            data: {
                userID: getCurrentUserId(getState()),
                callID: connectedCallID(getState()),
            },
        });
    };
}
export function updateScreenSharingStatus(dialingID: string, muted = false) {
    return async (dispatch: DispatchFunc, getState: () => GlobalState) => {
        dispatch({
            type: muted ? ActionTypes.VOICE_CHANNEL_USER_SCREEN_OFF : ActionTypes.VOICE_CHANNEL_USER_SCREEN_ON,
            data: {
                userID: getCurrentUserId(getState()),
                callID: connectedCallID(getState()),
            },
        });
    };
}
