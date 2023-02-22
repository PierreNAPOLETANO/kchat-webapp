// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormattedMessage} from 'react-intl';

import UpgradeOfferIcon from 'components/widgets/icons/upgrade_offer_icon';

import useGetUsageDeltas from 'components/common/hooks/useGetUsageDeltas';
import useGetUsage from 'components/common/hooks/useGetUsage';
import useGetLimits from 'components/common/hooks/useGetLimits';

import {ChannelType} from '@mattermost/types/channels';
import {General} from 'mattermost-redux/constants';
import {getCurrentTeamAccountId} from 'mattermost-redux/selectors/entities/teams';

import {getUsage} from 'actions/cloud';
import {redirectTokSuiteDashboard} from 'actions/global_actions';

import './channel_limit_indicator.scss';

type Props = {
    type: ChannelType;
    setLimitations: (limtation: Record<typeof General.OPEN_CHANNEL | typeof General.PRIVATE_CHANNEL, boolean>) => void;
};

const ChannelLimitIndicator = ({type, setLimitations}: Props) => {
    const dispatch = useDispatch();
    const currentTeamAccountId = useSelector(getCurrentTeamAccountId);
    const {public_channels: publicChannelsUsage, private_channels: privateChannelsUsage} = useGetUsage();
    const {public_channels: publicChannelsLimit, private_channels: privateChannelsLimit} = useGetLimits()[0];
    const {public_channels: publicChannelsUsageDelta, private_channels: privateChannelsUsageDelta} = useGetUsageDeltas();

    const publicChannelLimitReached = publicChannelsUsageDelta >= 0;
    const privateChannelLimitReached = privateChannelsUsageDelta >= 0;

    useEffect(() => {
        dispatch(getUsage());
    }, []);

    useEffect(() => {
        setLimitations({
            [General.OPEN_CHANNEL]: publicChannelLimitReached,
            [General.PRIVATE_CHANNEL]: privateChannelLimitReached,
        });
    }, [setLimitations, publicChannelLimitReached, privateChannelLimitReached]);

    if ((type === General.OPEN_CHANNEL && !publicChannelLimitReached) || (type === General.PRIVATE_CHANNEL && !privateChannelLimitReached)) {
        return null;
    }

    return (
        <div className='channel-limit-indicator'>
            <UpgradeOfferIcon/>
            <FormattedMessage
                id='channelLimitIndicator.text'
                defaultMessage='You have reached the limit of {type, select, O {public channels} P {private channels} other {}} ({usage, number}/{limit, number}) on your kSuite offer. <modifyOffer>Modify your offer</modifyOffer> to create additional channels.'
                values={{
                    type,
                    usage: type === General.OPEN_CHANNEL ? publicChannelsUsage : privateChannelsUsage,
                    limit: type === General.OPEN_CHANNEL ? publicChannelsLimit : privateChannelsLimit,
                    modifyOffer: (chunks: string[]) => (<a onClick={() => redirectTokSuiteDashboard(currentTeamAccountId)}>{chunks}</a>),
                }}
            />
        </div>
    );
};

export default ChannelLimitIndicator;
