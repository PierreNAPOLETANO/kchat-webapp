// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIntl} from 'react-intl';

import {closeModal} from 'actions/views/modals';
import {redirectToManagerProfile} from 'actions/global_actions';
import {isModalOpen} from 'selectors/views/modals';
import {GlobalState} from 'types/store';
import {isCurrentUserSystemAdmin} from 'mattermost-redux/selectors/entities/users';

import {ModalIdentifiers} from 'utils/constants';
import {isLimited} from 'utils/limits';

import GenericModal from 'components/generic_modal';
import ChannelLimitReachedIcon from 'components/widgets/icons/channel_limit_reached_icon';
import useGetUsage from 'components/common/hooks/useGetUsage';
import useGetLimits from 'components/common/hooks/useGetLimits';

import '../limit_modal.scss';

const ChannelLimitReachedModal = () => {
    const {formatMessage} = useIntl();
    const dispatch = useDispatch();

    const isAdmin = useSelector((state: GlobalState) => isCurrentUserSystemAdmin(state));
    const show = useSelector((state: GlobalState) => isModalOpen(state, ModalIdentifiers.CHANNEL_LIMIT_REACHED));

    const [limits, limitsLoaded] = useGetLimits();
    const {public_channels: publicChannelLimit, private_channels: privateChannelLimit} = limits;
    const {public_channels: publicChannelUsage, private_channels: privateChannelUsage, usageLoaded} = useGetUsage();

    const handleConfirm = () => {
        if (!isAdmin) {
            return dispatch(closeModal(ModalIdentifiers.CHANNEL_LIMIT_REACHED));
        }
        return redirectToManagerProfile();
    };

    let handleCancel;
    if (isAdmin) {
        handleCancel = () => dispatch(closeModal(ModalIdentifiers.CHANNEL_LIMIT_REACHED));
    }

    const header = (
        <div className='limit-modal-header'>
            <div className='limit-modal-header__icon'>
                <ChannelLimitReachedIcon/>
            </div>
            <div className='limit-modal-header__title'>
                {formatMessage({
                    id: 'channelLimit.title',
                    defaultMessage: 'Create new channels to better communicate with your organization’s members',
                })}
            </div>
        </div>
    );

    const content = (
        <div className='limit-modal-content'>
            {formatMessage({
                id: 'channelLimit.subtitle',
                defaultMessage: 'You have reached the limit of public channels ({publicChannelUsage, number}/{publicChannelLimit, number}) and private channels ({privateChannelUsage, number}/{privateChannelLimit, number}) on your kChat. To create additional ones, you need to subscribe to a premium package.',
            }, {
                publicChannelUsage,
                publicChannelLimit,
                privateChannelUsage,
                privateChannelLimit,
            })}
        </div>
    );

    const confirmButtonText = isAdmin ? formatMessage({id: 'limitModal.upgrade', defaultMessage: 'Modify my offer'}) : formatMessage({id: 'general_button.close', defaultMessage: 'Close'});

    if (!usageLoaded || !limitsLoaded || !isLimited(limits)) {
        return null;
    }

    return (
        <GenericModal
            id='ChannelLimitReachedModal'
            show={show}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
            modalHeaderText={header}
            confirmButtonText={confirmButtonText}
        >
            {content}
        </GenericModal>
    );
};

export default ChannelLimitReachedModal;
