// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {bindActionCreators, Dispatch} from 'redux';

import timezones from 'timezones.json';

import {GenericAction} from 'mattermost-redux/types/actions';

import {savePreferences} from 'mattermost-redux/actions/preferences';
import {autoUpdateTimezone} from 'mattermost-redux/actions/timezone';
import {updateMe} from 'mattermost-redux/actions/users';
import {getConfig, getLicense} from 'mattermost-redux/selectors/entities/general';
import {getCurrentUserId, getUser} from 'mattermost-redux/selectors/entities/users';
import {get, isCollapsedThreadsAllowed, getCollapsedThreadsPreference} from 'mattermost-redux/selectors/entities/preferences';
import {getTimezoneLabel, makeGetUserTimezone} from 'mattermost-redux/selectors/entities/timezone';
import {getUserCurrentTimezone} from 'mattermost-redux/utils/timezone_utils';

import {GlobalState} from 'types/store';
import {Preferences} from 'utils/constants';

import {CollapsedThreads} from '@mattermost/types/config';

import RhsSettingsDisplay from './rhs_settings_display';

export function makeMapStateToProps() {
    const getUserTimezone = makeGetUserTimezone();

    return (state: GlobalState) => {
        const config = getConfig(state);
        const currentUserId = getCurrentUserId(state);
        const userTimezone = getUserTimezone(state, currentUserId);
        const automaticTimezoneNotSet = userTimezone && userTimezone.useAutomaticTimezone && !userTimezone.automaticTimezone;
        const shouldAutoUpdateTimezone = !userTimezone || automaticTimezoneNotSet;
        const timezoneLabel = getTimezoneLabel(state, currentUserId);
        const allowCustomThemes = config.AllowCustomThemes === 'true';
        const enableLinkPreviews = config.EnableLinkPreviews === 'true';
        const defaultClientLocale = config.DefaultClientLocale as string;
        const enableThemeSelection = config.EnableThemeSelection === 'true';
        const enableTimezone = config.ExperimentalTimezone === 'true';
        const lockTeammateNameDisplay = getLicense(state).LockTeammateNameDisplay === 'true' && config.LockTeammateNameDisplay === 'true';
        const configTeammateNameDisplay = config.TeammateNameDisplay as string;
        const emojiPickerEnabled = config.EnableEmojiPicker === 'true';
        const lastActiveTimeEnabled = config.EnableLastActiveTime === 'true';

        return {
            lockTeammateNameDisplay,
            allowCustomThemes,
            configTeammateNameDisplay,
            enableLinkPreviews,
            defaultClientLocale,
            enableThemeSelection,
            enableTimezone,
            timezones,
            timezoneLabel,
            userTimezone,
            shouldAutoUpdateTimezone,
            currentUserTimezone: getUserCurrentTimezone(userTimezone) as string,
            availabilityStatusOnPosts: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.AVAILABILITY_STATUS_ON_POSTS, Preferences.AVAILABILITY_STATUS_ON_POSTS_DEFAULT),
            teammateNameDisplay: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.NAME_NAME_FORMAT, configTeammateNameDisplay),
            channelDisplayMode: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.CHANNEL_DISPLAY_MODE, Preferences.CHANNEL_DISPLAY_MODE_DEFAULT),
            messageDisplay: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.MESSAGE_DISPLAY, Preferences.MESSAGE_DISPLAY_DEFAULT),
            colorizeUsernames: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.COLORIZE_USERNAMES, Preferences.COLORIZE_USERNAMES_DEFAULT),
            collapseDisplay: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.COLLAPSE_DISPLAY, Preferences.COLLAPSE_DISPLAY_DEFAULT),
            collapsedReplyThreadsAllowUserPreference: isCollapsedThreadsAllowed(state) && getConfig(state).CollapsedThreads !== CollapsedThreads.ALWAYS_ON,
            collapsedReplyThreads: getCollapsedThreadsPreference(state),
            clickToReply: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.CLICK_TO_REPLY, Preferences.CLICK_TO_REPLY_DEFAULT),
            linkPreviewDisplay: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.LINK_PREVIEW_DISPLAY, Preferences.LINK_PREVIEW_DISPLAY_DEFAULT),
            oneClickReactionsOnPosts: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.ONE_CLICK_REACTIONS_ENABLED, Preferences.ONE_CLICK_REACTIONS_ENABLED_DEFAULT),
            emojiPickerEnabled,
            showUnreadsCategory: get(state, Preferences.CATEGORY_SIDEBAR_SETTINGS, 'show_unread_section'),
            unreadScrollPosition: get(state, Preferences.CATEGORY_ADVANCED_SETTINGS, Preferences.UNREAD_SCROLL_POSITION),
            militaryTime: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.USE_MILITARY_TIME, Preferences.USE_MILITARY_TIME_DEFAULT),
            lastActiveDisplay: getUser(state, currentUserId).props?.show_last_active,
            lastActiveTimeEnabled,
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            autoUpdateTimezone,
            savePreferences,
            updateMe,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(RhsSettingsDisplay);
