// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import IconButton from '@mattermost/compass-components/components/icon-button';

import * as React from 'react';

import {FormattedMessage} from 'react-intl';

import {useDispatch, useSelector} from 'react-redux';

import {startOrJoinCallInChannel} from 'actions/calls';
import {closeModal} from 'actions/views/modals';
import GenericModal from 'components/generic_modal';
import Avatars from 'components/widgets/users/avatars';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {DispatchFunc} from 'mattermost-redux/types/actions';

// import {Client4} from 'mattermost-redux/client';
import {UserProfile} from 'mattermost-redux/types/users';

import store from 'stores/redux_store.jsx';
import {GlobalState} from 'types/store';
import {ModalIdentifiers} from 'utils/constants';
import './ringing_dialog.scss';

type Props = {
    onClose?: () => void;
    calling: {
        users: {[userID: string]: UserProfile};
        channelID: string;
        userCalling: string;
    };
}

function DialingModal(props: Props) {
    const {users, channelID, userCalling} = props.calling;
    const dispatch = useDispatch<DispatchFunc>();
    const connectedChannelID = useSelector((state: GlobalState) => state.views.calls.connectedChannelID);
    const state = store.getState();
    const handleOnClose = () => {
        if (props.onClose) {
            props.onClose();
        }
        dispatch(closeModal(ModalIdentifiers.INCOMING_CALL));
    };
    const onHandleAccept = (e: MouseEvent) => {
        // const data = await Client4.acceptIncomingMeetCall(channelID);
        // console.log(data);

        e.preventDefault();
        e.stopPropagation();
        dispatch(startOrJoinCallInChannel(channelID, props.calling.channelID));
        handleOnClose();
    };
    const onHandleDecline = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleOnClose();

        // Client4.declineIncomingMeetCall(channelID);
    };

    if (connectedChannelID) {
        return null;
    }

    const usersIdsNotMe = Object.values(users).map((u) => u.id).filter((u) => u !== getCurrentUserId(state));

    return (
        <GenericModal
            aria-labelledby='contained-modal-title-vcenter'
            className='CallRingingModal'
            onExited={handleOnClose}
        >
            <div className='content-body'>
                {users && (
                    <Avatars
                        userIds={usersIdsNotMe}
                        size={usersIdsNotMe.length > 1 ? 'xl' : 'xxl'}
                    />
                )}
            </div>
            <div className='content-calling'>
                {users && (
                    <>
                        <div className='content-calling__user'>
                            {Object.values(users).map((user) => (
                                <>
                                    {user.id !== getCurrentUserId(state) && user.id === userCalling && (
                                        <>
                                            <span>
                                                {user.nickname}
                                            </span>
                                            {Object.values(users).length > 2 && (
                                                <span className='more'>
                                                    <>
                                                        &nbsp;&nbsp;{'+'}{(Object.values(users).length - 2)}
                                                    </>
                                                </span>
                                            )}
                                        </>
                                    )}
                                </>
                            ))}
                        </div>
                        <div className='content-calling__info'>
                            <>
                                <FormattedMessage
                                    id='calling_modal.alling'
                                    defaultMessage='calling'
                                />
                            </>
                        </div>
                    </>
                )}
            </div>
            <div className='content-actions'>
                <IconButton
                    className='decline'
                    size={'md'}
                    icon={'close'}
                    onClick={onHandleDecline}
                    inverted={true}
                    aria-label='Decline'
                />
                <IconButton
                    className='accept'
                    size={'md'}
                    icon={'check'}
                    onClick={onHandleAccept}
                    inverted={true}
                    aria-label='Accept'
                />
            </div>
        </GenericModal>
    );
}

export default DialingModal;
