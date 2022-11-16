// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable no-console */
import React, {useRef} from 'react';
import {injectIntl, IntlShape, FormattedMessage} from 'react-intl';

// import {Channel, ChannelMembership} from 'mattermost-redux/types/channels';
import {useSelector} from 'react-redux';

import OverlayTrigger from 'components/overlay_trigger';
import {getCurrentChannelId} from 'mattermost-redux/selectors/entities/common';

import Tooltip from 'components/tooltip';

import Constants from 'utils/constants';

import {GlobalState} from 'types/store';

import KMeetIcon from '../widgets/icons/kmeet_icon';

import SvgCallComponent from './SvgCallComponent';

import './meet_button.scss';
import meetSvg from './static/kmeet.svg';

export type Props = {
    currentChannelID: string;
    hasCall?: boolean;
    intl: IntlShape;
    startCallInChannel: (channelID: unknown) => void;
    isInCall?: boolean;
}

function MeetButton(props: Props) {
    const {startCallInChannel} = props;

    // const connectedChannelID = useSelector((state: GlobalState) => state.views.calls.connectedChannelID);
    const ref = useRef<HTMLButtonElement>(null);
    const channelID = useSelector(getCurrentChannelId);
    const onClick = React.useCallback(() => {
        startCallInChannel(channelID);
    }, [channelID]);
    const tooltip = (
        <Tooltip
            id='call'
            className='meet-btn__overlay'
        >
            <FormattedMessage
                id={props.hasCall ? 'kmeet.calls.join' : 'kmeet.calls.start'}
                defaultMessage={props.hasCall ? 'Join call' : 'Start call'}
            />
        </Tooltip>
    );

    const btnClasses = 'btn meet-btn';
    return (
        <OverlayTrigger
            delayShow={Constants.OVERLAY_TIME_DELAY}
            placement='bottom'
            overlay={tooltip}
        >
            <div className='meet-btn__wrapper'>
                <button
                    type='button'
                    className={btnClasses}
                    onClick={onClick}
                    ref={ref}
                >
                    <img
                        src={meetSvg}
                        className='meet-btn__icon meet-btn__icon--24'
                    />
                    <span className='meet-btn__text'>
                        <FormattedMessage
                            id={props.hasCall ? 'kmeet.calls.join' : 'kmeet.calls.start'}
                            defaultMessage={props.hasCall ? 'Join call' : 'Start call'}
                        />
                    </span>
                </button>
                <button
                    type='button'
                    className={btnClasses}
                    onClick={onClick}
                    ref={ref}
                >
                    <img
                        src={meetSvg}
                        className='meet-btn__icon meet-btn__icon--16'
                    />
                    <span className='meet-btn__text'>
                        <FormattedMessage
                            id={props.hasCall ? 'kmeet.calls.join' : 'kmeet.calls.start'}
                            defaultMessage={props.hasCall ? 'Join call' : 'Start call'}
                        />
                    </span>
                </button>
                <button
                    type='button'
                    className={`${btnClasses} btn-light`}
                    onClick={onClick}
                    ref={ref}
                >
                    <img
                        src={meetSvg}
                        className='meet-btn__icon meet-btn__icon--24'
                    />
                    <span className='meet-btn__text'>
                        <FormattedMessage
                            id={props.hasCall ? 'kmeet.calls.join' : 'kmeet.calls.start'}
                            defaultMessage={props.hasCall ? 'Join call' : 'Start call'}
                        />
                    </span>
                </button>
                <button
                    type='button'
                    className={`${btnClasses} btn-light`}
                    onClick={onClick}
                    ref={ref}
                >
                    <img
                        src={meetSvg}
                        className='meet-btn__icon meet-btn__icon--16'
                    />
                    <span className='meet-btn__text'>
                        <FormattedMessage
                            id={props.hasCall ? 'kmeet.calls.join' : 'kmeet.calls.start'}
                            defaultMessage={props.hasCall ? 'Join call' : 'Start call'}
                        />
                    </span>
                </button>
            </div>
        </OverlayTrigger>
    );
}

const wrappedComponent = injectIntl(MeetButton);
wrappedComponent.displayName = 'injectIntl(MeetButton)';
export default wrappedComponent;
