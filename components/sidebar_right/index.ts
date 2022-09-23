// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {getCurrentChannel} from 'mattermost-redux/selectors/entities/channels';

import {
    setRhsExpanded,
    showChannelInfo,
    showPinnedPosts,
    showChannelFiles,
    openRHSSearch,
    closeRightHandSide,
    openAtPrevious,
    updateSearchTerms,
    showSettings,
} from 'actions/views/rhs';
import {
    getIsRhsExpanded,
    getIsRhsOpen,
    getRhsState,
    getSelectedChannel,
    getSelectedPostId,
    getSelectedPostCardId,
    getPreviousRhsState,
} from 'selectors/rhs';
import {RHSStates} from 'utils/constants';

import {GlobalState} from 'types/store';

import SidebarRight from './sidebar_right';

function mapStateToProps(state: GlobalState) {
    const rhsState = getRhsState(state);
    const channel = getCurrentChannel(state);

    const selectedPostId = getSelectedPostId(state);
    const selectedPostCardId = getSelectedPostCardId(state);

    return {
        isExpanded: getIsRhsExpanded(state),
        isOpen: getIsRhsOpen(state),
        channel,
        postRightVisible: Boolean(selectedPostId),
        postCardVisible: Boolean(selectedPostCardId),
        searchVisible: Boolean(rhsState) && rhsState !== RHSStates.PLUGIN && rhsState !== RHSStates.SETTINGS,
        previousRhsState: getPreviousRhsState(state),
        isPinnedPosts: rhsState === RHSStates.PIN,
        isChannelFiles: rhsState === RHSStates.CHANNEL_FILES,
        isChannelInfo: rhsState === RHSStates.CHANNEL_INFO,
        isChannelMembers: rhsState === RHSStates.CHANNEL_MEMBERS,
        isPluginView: rhsState === RHSStates.PLUGIN,
        isSettings: rhsState === RHSStates.SETTINGS,
        rhsChannel: getSelectedChannel(state),
        selectedPostId,
        selectedPostCardId,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators({
            setRhsExpanded,
            showPinnedPosts,
            openRHSSearch,
            closeRightHandSide,
            openAtPrevious,
            updateSearchTerms,
            showChannelFiles,
            showChannelInfo,
            showSettings,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarRight);
