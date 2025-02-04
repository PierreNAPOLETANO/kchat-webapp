// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {setCategoryCollapsed, setCategorySorting} from 'mattermost-redux/actions/channel_categories';
import {GenericAction} from 'mattermost-redux/types/actions';
import {savePreferences} from 'mattermost-redux/actions/preferences';
import {ChannelCategory} from '@mattermost/types/channel_categories';
import {getBool} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser, getCurrentUserId, isCurrentUserGuestUser} from 'mattermost-redux/selectors/entities/users';
import {isAdmin} from 'mattermost-redux/utils/user_utils';
import {Preferences, Touched} from 'utils/constants';

import {OnboardingTourSteps, OnboardingTourStepsForGuestUsers, TutorialTourName} from 'components/tours';
import {OnboardingTasksName} from 'components/onboarding_tasks';

import {getDraggingState, makeGetFilteredChannelIdsForCategory} from 'selectors/views/channel_sidebar';
import {GlobalState} from 'types/store';
import {getShowTutorialStep} from 'selectors/onboarding';

import SidebarCategory from './sidebar_category';

type OwnProps = {
    category: ChannelCategory;
}

function makeMapStateToProps() {
    const getChannelIdsForCategory = makeGetFilteredChannelIdsForCategory();

    return (state: GlobalState, ownProps: OwnProps) => {
        const isGuest = isCurrentUserGuestUser(state);
        const showDirectMessagesTutorialStep = getShowTutorialStep(state, {
            tourName: isGuest ? TutorialTourName.ONBOARDING_TUTORIAL_STEP_FOR_GUESTS : TutorialTourName.ONBOARDING_TUTORIAL_STEP,
            taskName: OnboardingTasksName.CHANNELS_TOUR,
            tourStep: isGuest ? OnboardingTourStepsForGuestUsers.DIRECT_MESSAGES : OnboardingTourSteps.DIRECT_MESSAGES,
        });

        const showChannelsTutorialStep = getShowTutorialStep(state, {
            tourName: isGuest ? TutorialTourName.ONBOARDING_TUTORIAL_STEP_FOR_GUESTS : TutorialTourName.ONBOARDING_TUTORIAL_STEP,
            taskName: OnboardingTasksName.CHANNELS_TOUR,
            tourStep: isGuest ? OnboardingTourStepsForGuestUsers.CHANNELS : OnboardingTourSteps.CHANNELS,
        });

        return {
            channelIds: getChannelIdsForCategory(state, ownProps.category),
            draggingState: getDraggingState(state),
            touchedInviteMembersButton: getBool(state, Preferences.TOUCHED, Touched.INVITE_MEMBERS),
            currentUserId: getCurrentUserId(state),
            isAdmin: isAdmin(getCurrentUser(state).roles),
            showDirectMessagesTutorialStep,
            showChannelsTutorialStep,
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            setCategoryCollapsed,
            setCategorySorting,
            savePreferences,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(SidebarCategory);
