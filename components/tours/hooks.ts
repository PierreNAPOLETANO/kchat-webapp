// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useCallback} from 'react';

import {useDispatch, useSelector} from 'react-redux';

import {getCurrentUserId, isCurrentUserGuestUser} from 'mattermost-redux/selectors/entities/users';
import {getCurrentRelativeTeamUrl} from 'mattermost-redux/selectors/entities/teams';
import {getCurrentTeamDefaultChannelId} from 'mattermost-redux/selectors/entities/channels';
import {CategoryTypes} from 'mattermost-redux/constants/channel_categories';
import {ChannelCategory} from '@mattermost/types/channel_categories';

import {savePreferences} from 'mattermost-redux/actions/preferences';
import {close as closeLhs, open as openLhs} from 'actions/views/lhs';
import {setAddChannelDropdown} from 'actions/views/add_channel_dropdown';
import {switchToChannels} from 'actions/views/onboarding_tasks';
import {getHistory} from 'utils/browser_history';
import {GlobalState} from 'types/store';
import {setStatusDropdown} from 'actions/views/status_dropdown';
import {collapseAllCategoriesExcept} from 'actions/views/channel_sidebar';

import {OnboardingTaskCategory, OnboardingTaskList, OnboardingTasksName} from '../onboarding_tasks';

import {setProductMenuSwitcherOpen} from '../../actions/views/product_menu';

import {
    CrtTutorialSteps,
    ExploreOtherToolsTourSteps,
    FINISHED,
    OnboardingTourSteps,
    TTNameMapToTourSteps,
    TutorialTourName,
} from './constant';

export const useGetTourSteps = (tourCategory: string) => {
    const pluginsList = useSelector((state: GlobalState) => state.plugins.plugins);

    let tourSteps: Record<string, number> = TTNameMapToTourSteps[tourCategory];

    if (tourCategory === TutorialTourName.EXPLORE_OTHER_TOOLS) {
        const boards = pluginsList.focalboard;
        const playbooks = pluginsList.playbooks;
        const steps: Record<string, number> = tourSteps as typeof ExploreOtherToolsTourSteps;
        if (!playbooks) {
            delete steps.PLAYBOOKS_TOUR;
        }

        if (!boards) {
            delete steps.BOARDS_TOUR;
        }
        tourSteps = steps;
    }
    return tourSteps;
};
export const useHandleNavigationAndExtraActions = (tourCategory: string) => {
    const dispatch = useDispatch();
    const currentUserId = useSelector(getCurrentUserId);
    const defaultChannelId = useSelector(getCurrentTeamDefaultChannelId);
    const teamUrl = useSelector((state: GlobalState) => getCurrentRelativeTeamUrl(state));

    const nextStepActions = useCallback((step: number) => {
        if (tourCategory === TutorialTourName.ONBOARDING_TUTORIAL_STEP) {
            switch (step) {
            case OnboardingTourSteps.CHANNELS_AND_DIRECT_MESSAGES : {
                dispatch(openLhs());
                break;
            }
            case OnboardingTourSteps.CREATE_AND_JOIN_CHANNELS : {
                dispatch(setAddChannelDropdown(true));
                break;
            }
            case OnboardingTourSteps.INVITE_PEOPLE : {
                dispatch(setAddChannelDropdown(true));
                break;
            }
            case OnboardingTourSteps.SEND_MESSAGE : {
                dispatch(switchToChannels());
                break;
            }
            case OnboardingTourSteps.CHANNELS: {
                dispatch(openLhs());
                dispatch(collapseAllCategoriesExcept((category: ChannelCategory) => !category.channel_ids.includes(defaultChannelId)));
                break;
            }
            case OnboardingTourSteps.JOIN_CHANNELS: {
                dispatch(setAddChannelDropdown(true));
                break;
            }
            case OnboardingTourSteps.CREATE_CHANNELS: {
                dispatch(setAddChannelDropdown(true));
                break;
            }
            case OnboardingTourSteps.CHANNEL_HEADER: {
                dispatch(switchToChannels());
                dispatch(setAddChannelDropdown(false));
                break;
            }
            case OnboardingTourSteps.DIRECT_MESSAGES: {
                dispatch(openLhs());
                dispatch(collapseAllCategoriesExcept((category: ChannelCategory) => category.type !== CategoryTypes.DIRECT_MESSAGES));
                break;
            }
            case OnboardingTourSteps.KMEET: {
                dispatch(switchToChannels());
                break;
            }
            case OnboardingTourSteps.STATUS: {
                dispatch(setStatusDropdown(true));
                break;
            }
            case OnboardingTourSteps.PROFILE: {
                dispatch(setStatusDropdown(true));
                break;
            }
            case OnboardingTourSteps.FINISHED: {
                let preferences = [
                    {
                        user_id: currentUserId,
                        category: OnboardingTaskCategory,
                        name: OnboardingTasksName.CHANNELS_TOUR,
                        value: FINISHED.toString(),
                    },
                ];
                preferences = [...preferences,
                    {
                        user_id: currentUserId,
                        category: OnboardingTaskCategory,
                        name: OnboardingTaskList.ONBOARDING_TASK_LIST_OPEN,
                        value: 'true',
                    },
                ];
                dispatch(savePreferences(currentUserId, preferences));
                dispatch(setStatusDropdown(false));
                break;
            }
            default:
            }
        } else if (tourCategory === TutorialTourName.CRT_TUTORIAL_STEP) {
            switch (step) {
            case CrtTutorialSteps.WELCOME_POPOVER : {
                dispatch(openLhs());
                break;
            }
            case CrtTutorialSteps.LIST_POPOVER : {
                const nextUrl = `${teamUrl}/threads`;
                getHistory().push(nextUrl);
                break;
            }
            case CrtTutorialSteps.UNREAD_POPOVER : {
                break;
            }
            default:
            }
        } else if (tourCategory === TutorialTourName.EXPLORE_OTHER_TOOLS) {
            switch (step) {
            case ExploreOtherToolsTourSteps.FINISHED : {
                dispatch(setProductMenuSwitcherOpen(false));
                let preferences = [
                    {
                        user_id: currentUserId,
                        category: OnboardingTaskCategory,
                        name: OnboardingTasksName.EXPLORE_OTHER_TOOLS,
                        value: FINISHED.toString(),
                    },
                ];
                preferences = [...preferences,
                    {
                        user_id: currentUserId,
                        category: OnboardingTaskCategory,
                        name: OnboardingTaskList.ONBOARDING_TASK_LIST_OPEN,
                        value: 'true',
                    },
                ];
                dispatch(savePreferences(currentUserId, preferences));
                break;
            }
            default:
            }
        }
    }, [currentUserId, teamUrl, tourCategory]);

    const lastStepActions = useCallback((lastStep: number) => {
        if (tourCategory === TutorialTourName.ONBOARDING_TUTORIAL_STEP) {
            switch (lastStep) {
            case OnboardingTourSteps.CREATE_AND_JOIN_CHANNELS : {
                dispatch(setAddChannelDropdown(false));
                break;
            }
            case OnboardingTourSteps.INVITE_PEOPLE : {
                dispatch(setAddChannelDropdown(false));
                break;
            }
            default:
            }
        } else if (tourCategory === TutorialTourName.CRT_TUTORIAL_STEP) {
            switch (lastStep) {
            case CrtTutorialSteps.WELCOME_POPOVER : {
                dispatch(closeLhs());
                break;
            }
            default:
            }
        }
    }, [currentUserId, tourCategory]);

    return useCallback((step: number, lastStep: number) => {
        lastStepActions(lastStep);
        nextStepActions(step);
    }, [nextStepActions, lastStepActions]);
};
