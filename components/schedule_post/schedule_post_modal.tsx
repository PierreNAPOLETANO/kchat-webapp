// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useIntl} from 'react-intl';
import {Moment} from 'moment-timezone';

import {schedulePost} from 'mattermost-redux/actions/posts';
import {closeModal} from 'actions/views/modals';

import GenericModal from 'components/generic_modal';
import DateTimeInput, {getRoundedTime} from 'components/custom_status/date_time_input';
import SchedulePostRepeatActions from 'components/schedule_post/schedule_post_repeat_actions';

import {toUTCUnix} from 'utils/datetime';
import {ModalIdentifiers} from 'utils/constants';

import './schedule_post_modal.scss';

type Props = {
    channelId: string;
    message: string;
    timestamp: Moment;
    timezone?: string;
}

const SchedulePostModal = ({channelId, message, timestamp, timezone}: Props) => {
    const dispatch = useDispatch();
    const {formatMessage} = useIntl();
    const [scheduleTimestamp, setScheduleTimestamp] = useState<Moment>(getRoundedTime(timestamp));
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
    const [isRepeatChecked, setIsRepeatChecked] = useState<boolean>(false);
    const [areRepeatOptionsValid, setAreRepeatOptionsValid] = useState<boolean>(true);

    // TODO: clear input
    const handleConfirm = () => dispatch(schedulePost(channelId, message, toUTCUnix(scheduleTimestamp.toDate())));

    const handleRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsRepeatChecked(e.target.checked);
    };

    const handleExit = () => dispatch(closeModal(ModalIdentifiers.SCHEDULE_POST));

    const handleRepeatOptionsValidation = (isValid: boolean) => {
        if (areRepeatOptionsValid !== isValid) {
            setAreRepeatOptionsValid(isValid);
        }
    };

    const modalHeaderText = (
        <div>
            <h1>
                {formatMessage({
                    id: 'create_post.schedule_post.modal.header',
                    defaultMessage: 'Schedule draft',
                })}
            </h1>
            {timezone && <span>{timezone}</span>}
        </div>
    );

    const confirmButtonText = formatMessage({
        id: 'create_post.schedule_post.modal.confirm',
        defaultMessage: 'Schedule',
    });

    const repeatCheckboxLabel = formatMessage({
        id: 'create_post.schedule_post.modal.repeat.checkbox',
        defaultMessage: 'Repeat',
    });

    const isConfirmDisabled = isMenuOpen || isDatePickerOpen || (isRepeatChecked && !areRepeatOptionsValid);

    return (
        <GenericModal
            className='schedule-post-modal'
            modalHeaderText={modalHeaderText}
            confirmButtonText={confirmButtonText}
            isConfirmDisabled={isConfirmDisabled}
            handleConfirm={handleConfirm}
            handleCancel={handleExit}
            onExited={handleExit}
        >
            <DateTimeInput
                time={scheduleTimestamp}
                handleChange={setScheduleTimestamp}
                timezone={timezone}
                onMenuChange={setIsMenuOpen}
                setIsDatePickerOpen={setIsDatePickerOpen}
            />
            {/* TODO: reset repeat props on deselection*/}
            <div className='schedule-post-modal__repeat-checkbox'>
                <label>
                    <input
                        type='checkbox'
                        checked={isRepeatChecked}
                        onChange={handleRepeatChange}
                    />
                    {repeatCheckboxLabel}
                </label>
            </div>
            <SchedulePostRepeatActions
                show={isRepeatChecked}
                timestamp={scheduleTimestamp}
                timezone={timezone}
                setAreRepeatOptionsValid={handleRepeatOptionsValidation}
            />
        </GenericModal>
    );
};

export default SchedulePostModal;
