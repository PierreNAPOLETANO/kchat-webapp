// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import IconButton from '@infomaniak/compass-components/components/icon-button';

import {useDispatch, useSelector} from 'react-redux';

import OverlayTrigger from 'components/overlay_trigger';
import Tooltip from 'components/tooltip';

import {ModalData} from 'types/actions';

import Constants, {ModalIdentifiers, RHSStates} from 'utils/constants';
import {GlobalState} from 'types/store';
import {getRhsState} from 'selectors/rhs';
import {closeRightHandSide, showSettingss} from 'actions/views/rhs';
import UserSettingsModal from 'components/user_settings/modal';

type Props = {
    actions: {
        openModal: <P>(modalData: ModalData<P>) => void;
    };
};

const SettingsButton = (props: Props): JSX.Element | null => {
    const dispatch = useDispatch();
    const rhsState = useSelector((state: GlobalState) => getRhsState(state));

    const settingButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (rhsState === RHSStates.SETTINGS) {
            dispatch(closeRightHandSide());
        } else {
            dispatch(showSettingss());
        }
    };

    const tooltip = (
        <Tooltip id='productSettings'>
            <FormattedMessage
                id='global_header.productSettings'
                defaultMessage='Settings'
            />
        </Tooltip>
    );

    return (
        <><OverlayTrigger
            trigger={['hover', 'focus']}
            delayShow={Constants.OVERLAY_TIME_DELAY}
            placement="bottom"
            overlay={tooltip}
        >
            <IconButton
                size={'sm'}
                icon={'settings-outline'}
                toggled={rhsState === RHSStates.SETTINGS}
                onClick={settingButtonClick}
                inverted={true}
                compact={true}
                aria-label="Select to open the settings modal." // proper wording and translation needed
            />


        </OverlayTrigger><IconButton
            size={'sm'}
            icon={'settings-outline'}
            toggled={rhsState === RHSStates.SETTINGS}
            onClick={(): void => {
                props.actions.openModal({
                    modalId: ModalIdentifiers.USER_SETTINGS,
                    dialogType: UserSettingsModal,
                    dialogProps: {isContentProductSettings: true},
                });
            }}
            inverted={true}
            compact={true}
            aria-label="Select to open the settings modal." // proper wording and translation needed
        /></>

);
};

export default SettingsButton;
