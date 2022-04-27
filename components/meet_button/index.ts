// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {GlobalState} from 'types/store';

import {connectedChannelID, voiceConnectedUsers} from 'selectors/calls';

import {getCurrentChannelId, getCurrentUserId} from 'mattermost-redux/selectors/entities/common';

import {getProfilesByIds} from 'mattermost-redux/actions/users';

import {ActionTypes} from 'utils/constants';

import MeetButton from './meet_button';

function startCallInChannel() {
    return async (dispatch, getState) => {
        const state = getState();
        const channelID = getCurrentChannelId(state);
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

        if (!connectedChannelID(getState())) {
            // connectCall(channelID);
            dispatch({
                type: ActionTypes.VOICE_CHANNEL_ENABLE,
            });
            await dispatch({
                type: ActionTypes.VOICE_CHANNEL_USER_CONNECTED,
                data: {
                    channelID,
                    userID: getCurrentUserId(getState()),
                    currentUserID: getCurrentUserId(getState()),
                },
            });
        } else if (connectedChannelID(getState()) !== channelID) {
            dispatch({
                type: ActionTypes.SHOW_SWITCH_CALL_MODAL,
            });
        }
    };
}

function mapStateToProps(state: GlobalState) {
    return {
        currentChannelID: getCurrentChannelId(state),
        hasCall: voiceConnectedUsers(state).length > 0,
    };
}

const actions = {
    startCallInChannel,
};

export default connect(mapStateToProps, actions)(MeetButton);
