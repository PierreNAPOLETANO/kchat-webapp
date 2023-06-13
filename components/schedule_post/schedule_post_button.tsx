// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIntl} from 'react-intl';
import {Button, styled} from '@mui/material';
import {ChevronDownIcon} from '@infomaniak/compass-icons/components';

import {openModal} from 'actions/views/modals';
import {getCurrentUserTimezone} from 'selectors/general';

import SchedulePostMenu, {SchedulePostMenuOption} from 'components/schedule_post/schedule_post_menu';
import SchedulePostModal from 'components/schedule_post/schedule_post_modal';
import OverlayTrigger from 'components/overlay_trigger';
import Tooltip from 'components/tooltip';

import Constants, {ModalIdentifiers} from 'utils/constants';
import {getCurrentMomentForTimezone} from 'utils/timezone';
import {toUTCUnix} from 'utils/datetime';

const StyledSchedulePostButton = styled(Button)`
    display: flex;
    height: 32px;
    min-width: 26px !important;
    padding: 0 5px;
    background: var(--button-bg);
    color: var(--button-color);
    cursor: pointer;
    place-content: center;
    place-items: center;
    transition: color 150ms;
    border-color: var(--button-color-16);

    :hover {
        background-color: var(--button-bg);
        border-color: var(--button-color-16);
    }

    &--disabled,
    &[disabled] {
        background: rgba(var(--center-channel-color-rgb), 0.08);

        svg {
            fill: rgba(var(--center-channel-color-rgb), 0.32);
        }
    }

    .android &,
    .ios & {
        display: flex;
    }
`;

type Props = {
    disabled: boolean;
    getAnchorEl: () => HTMLDivElement | null;
    handleSchedulePost: (scheduleUTCTimestamp: number) => void;
};

const SchedulePostButton = ({disabled, handleSchedulePost, getAnchorEl}: Props) => {
    const dispatch = useDispatch();
    const timezone = useSelector(getCurrentUserTimezone);
    const {formatMessage} = useIntl();
    const [open, setOpen] = useState(false);

    const tooltip = (
        <Tooltip id='schedule-post-tooltip'>
            {formatMessage({
                id: 'create_post.schedule_post.tooltip',
                defaultMessage: 'Schedule a post',
            })}
        </Tooltip>
    );

    const handleMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSchedulePostMenu = (optionName: SchedulePostMenuOption['name']) => {
        setOpen(false);
        const timestamp = getCurrentMomentForTimezone(timezone);
        switch (optionName) {
        case 'tomorrow':
            timestamp.add(1, 'day').hours(9).minutes(0).seconds(0);
            break;
        case 'monday':
            timestamp.add(1, 'week').isoWeekday(1).hours(9).minutes(0).seconds(0);
            break;
        case 'custom':
            dispatch(openModal({
                modalId: ModalIdentifiers.SCHEDULE_POST,
                dialogType: SchedulePostModal,
                dialogProps: {
                    timestamp,
                    timezone,
                    onConfirm: handleSchedulePost,
                },
            }));
            return;
        }
        handleSchedulePost(toUTCUnix(timestamp.toDate()));
    };

    return (
        <>
            <OverlayTrigger
                overlay={tooltip}
                delayShow={Constants.OVERLAY_TIME_DELAY}
                placement='top'
                trigger={'hover'}
            >
                <StyledSchedulePostButton
                    disableRipple={true}
                    disabled={disabled}
                    onClick={handleMenu}
                    aria-label={formatMessage({
                        id: 'create_post.schedule_post.aria',
                        defaultMessage: 'Schedule a post',
                    })}
                >
                    <ChevronDownIcon size={16}/>
                </StyledSchedulePostButton>
            </OverlayTrigger>
            <SchedulePostMenu
                open={open}
                timezone={timezone}
                getAnchorEl={getAnchorEl}
                onClose={handleClose}
                handleSchedulePostMenu={handleSchedulePostMenu}
            />
        </>
    );
};

export default SchedulePostButton;
