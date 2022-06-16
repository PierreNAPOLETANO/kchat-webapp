// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';

import {getProfiles} from 'mattermost-redux/actions/users';
import {ActionFunc, GenericAction} from 'mattermost-redux/types/actions';
import {getTeamByName} from 'mattermost-redux/selectors/entities/teams';
import {getRedirectChannelNameForTeam, getChannel} from 'mattermost-redux/selectors/entities/channels';
import {isCollapsedThreadsEnabled, insightsAreEnabled} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {getIsRhsOpen, getIsRhsMenuOpen} from 'selectors/rhs';
import {getIsLhsOpen} from 'selectors/lhs';
import {connectedChannelID, expandedView} from 'selectors/calls';
import {getLastViewedChannelNameByTeamName, getLastViewedTypeByTeamName} from 'selectors/local_storage';

import {GlobalState} from 'types/store';

import {PreviousViewedTypes} from 'utils/constants';

import CenterChannel from './center_channel';

type Props = {
    match: {
        url: string;
        params: {
            team: string;
        };
    };
};

const mapStateToProps = (state: GlobalState, ownProps: Props) => {
    const lastViewedType = getLastViewedTypeByTeamName(state, ownProps.match.params.team);
    let channelName = getLastViewedChannelNameByTeamName(state, ownProps.match.params.team);
    const callChannel = getChannel(state, connectedChannelID(state));
    if (!channelName) {
        const team = getTeamByName(state, ownProps.match.params.team);
        channelName = getRedirectChannelNameForTeam(state, team!.id);
    }
    const shouldRouteToGlobalThreads = isCollapsedThreadsEnabled(state) && lastViewedType === PreviousViewedTypes.THREADS;
    const lastChannelPath = shouldRouteToGlobalThreads ? `${ownProps.match.url}/threads` : `${ownProps.match.url}/channels/${channelName}`;
    return {
        callChannel,
        lastChannelPath,
        lhsOpen: getIsLhsOpen(state),
        rhsOpen: getIsRhsOpen(state),
        rhsMenuOpen: getIsRhsMenuOpen(state),
        isCollapsedThreadsEnabled: isCollapsedThreadsEnabled(state),
        currentUserId: getCurrentUserId(state),
        insightsAreEnabled: insightsAreEnabled(state),
        callExpandedView: expandedView(state),
    };
};

type Actions = {
    getProfiles: (page?: number, perPage?: number, options?: Record<string, string | boolean>) => ActionFunc;
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc|GenericAction>, Actions>({
            getProfiles,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CenterChannel);

