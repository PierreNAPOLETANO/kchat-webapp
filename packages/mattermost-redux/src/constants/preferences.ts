// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Theme, ThemeKey} from 'mattermost-redux/selectors/entities/preferences';

const Preferences = {
    CATEGORY_CHANNEL_OPEN_TIME: 'channel_open_time',
    CATEGORY_CHANNEL_APPROXIMATE_VIEW_TIME: 'channel_approximate_view_time',
    CATEGORY_DIRECT_CHANNEL_SHOW: 'direct_channel_show',
    CATEGORY_GROUP_CHANNEL_SHOW: 'group_channel_show',
    CATEGORY_FLAGGED_POST: 'flagged_post',
    CATEGORY_AUTO_RESET_MANUAL_STATUS: 'auto_reset_manual_status',
    CATEGORY_NOTIFICATIONS: 'notifications',
    COLLAPSED_REPLY_THREADS: 'collapsed_reply_threads',
    COLLAPSED_REPLY_THREADS_OFF: 'off',
    COLLAPSED_REPLY_THREADS_ON: 'on',
    COLLAPSED_REPLY_THREADS_FALLBACK_DEFAULT: 'off',
    COMMENTS: 'comments',
    COMMENTS_ANY: 'any',
    COMMENTS_ROOT: 'root',
    COMMENTS_NEVER: 'never',
    EMAIL: 'email',
    EMAIL_INTERVAL: 'email_interval',
    INTERVAL_FIFTEEN_MINUTES: 15 * 60,
    INTERVAL_HOUR: 60 * 60,
    INTERVAL_IMMEDIATE: 30,

    // "immediate" is a 30 second interval
    INTERVAL_NEVER: 0,
    INTERVAL_NOT_SET: -1,
    CATEGORY_DISPLAY_SETTINGS: 'display_settings',
    NAME_NAME_FORMAT: 'name_format',
    DISPLAY_PREFER_NICKNAME: 'nickname_full_name',
    DISPLAY_PREFER_FULL_NAME: 'full_name',
    DISPLAY_PREFER_USERNAME: 'username',
    MENTION_KEYS: 'mention_keys',
    USE_MILITARY_TIME: 'use_military_time',

    CATEGORY_ACTIONS_MENU: 'actions_menu',
    NAME_ACTIONS_MENU_TUTORIAL_STATE: 'actions_menu_tutorial_state',
    ACTIONS_MENU_VIEWED: 'actions_menu_modal_viewed',

    CATEGORY_CUSTOM_STATUS: 'custom_status',
    NAME_CUSTOM_STATUS_TUTORIAL_STATE: 'custom_status_tutorial_state',
    NAME_RECENT_CUSTOM_STATUSES: 'recent_custom_statuses',
    CUSTOM_STATUS_MODAL_VIEWED: 'custom_status_modal_viewed',

    CATEGORY_SIDEBAR_SETTINGS: 'sidebar_settings',
    CHANNEL_SIDEBAR_ORGANIZATION: 'channel_sidebar_organization',
    LIMIT_VISIBLE_DMS_GMS: 'limit_visible_dms_gms',
    SHOW_UNREAD_SECTION: 'show_unread_section',
    CATEGORY_ADVANCED_SETTINGS: 'advanced_settings',
    ADVANCED_FILTER_JOIN_LEAVE: 'join_leave',
    ADVANCED_CODE_BLOCK_ON_CTRL_ENTER: 'code_block_ctrl_enter',
    ADVANCED_SEND_ON_CTRL_ENTER: 'send_on_ctrl_enter',
    CATEGORY_WHATS_NEW_MODAL: 'whats_new_modal',
    HAS_SEEN_SIDEBAR_WHATS_NEW_MODAL: 'has_seen_sidebar_whats_new_modal',

    CATEGORY_PERFORMANCE_DEBUGGING: 'performance_debugging',
    NAME_DISABLE_CLIENT_PLUGINS: 'disable_client_plugins',
    NAME_DISABLE_TELEMETRY: 'disable_telemetry',
    NAME_DISABLE_TYPING_MESSAGES: 'disable_typing_messages',

    UNREAD_SCROLL_POSITION: 'unread_scroll_position',
    UNREAD_SCROLL_POSITION_START_FROM_LEFT: 'start_from_left_off',
    UNREAD_SCROLL_POSITION_START_FROM_NEWEST: 'start_from_newest',

    CATEGORY_INSIGHTS: 'insights',
    NAME_INSIGHTS_TUTORIAL_STATE: 'insights_tutorial_state',
    INSIGHTS_VIEWED: 'insights_modal_viewed',

    CATEGORY_UPGRADE_CLOUD: 'upgrade_cloud',
    SYSTEM_CONSOLE_LIMIT_REACHED: 'system_console_limit_reached',

    CATEGORY_THEME: 'theme',
    THEMES: {
        ik: {
            type: 'Infomaniak',
            sidebarBg: '#292E3D',
            sidebarText: '#e0e0e0',
            sidebarUnreadText: '#ffffff',
            sidebarTextHoverBg: '#3E435B',
            sidebarTextActiveBorder: '#4CB7FF',
            sidebarTextActiveColor: '#ffffff',
            sidebarHeaderBg: '#181C28',
            sidebarHeaderTextColor: '#ffffff',
            sidebarTeamBarBg: '#181C28',
            onlineIndicator: '#3EBF4D',
            awayIndicator: '#FF8500',
            dndIndicator: '#F44336',
            mentionBg: '#ffffff',
            mentionBj: '#ffffff',
            mentionColor: '#1e325c',
            centerChannelBg: '#ffffff',
            centerChannelColor: '#3f4350',
            newMessageSeparator: '#cc8f00',
            linkColor: '#0098ff',
            buttonBg: '#0098ff',
            buttonColor: '#ffffff',
            errorTextColor: '#F44336',
            mentionHighlightBg: '#ffd470',
            mentionHighlightLink: '#1b1d22',
            codeTheme: 'github',
        },
        denim: {
            type: 'Denim',
            sidebarBg: '#1e325c',
            sidebarText: '#ffffff',
            sidebarUnreadText: '#ffffff',
            sidebarTextHoverBg: '#28427b',
            sidebarTextActiveBorder: '#5d89ea',
            sidebarTextActiveColor: '#ffffff',
            sidebarHeaderBg: '#192a4d',
            sidebarHeaderTextColor: '#ffffff',
            sidebarTeamBarBg: '#14213e',
            onlineIndicator: '#3db887',
            awayIndicator: '#ffbc1f',
            dndIndicator: '#d24b4e',
            mentionBg: '#ffffff',
            mentionBj: '#ffffff',
            mentionColor: '#1e325c',
            centerChannelBg: '#ffffff',
            centerChannelColor: '#3f4350',
            newMessageSeparator: '#cc8f00',
            linkColor: '#386fe5',
            buttonBg: '#1c58d9',
            buttonColor: '#ffffff',
            errorTextColor: '#d24b4e',
            mentionHighlightBg: '#ffd470',
            mentionHighlightLink: '#1b1d22',
            codeTheme: 'github',
        },
        quartz: {
            type: 'Quartz',
            sidebarBg: '#f4f4f6',
            sidebarText: '#090a0b',
            sidebarUnreadText: '#2d3039',
            sidebarTextHoverBg: '#ebebed',
            sidebarTextActiveBorder: '#32a4ec',
            sidebarTextActiveColor: '#2d3039',
            sidebarHeaderBg: '#e8e9ed',
            sidebarHeaderTextColor: '#2d3039',
            sidebarTeamBarBg: '#dddfe4',
            onlineIndicator: '#3db887',
            awayIndicator: '#f5ab07',
            dndIndicator: '#d24b4e',
            mentionBg: '#1c58d9',
            mentionBj: '#1c58d9',
            mentionColor: '#ffffff',
            centerChannelBg: '#ffffff',
            centerChannelColor: '#3f4350',
            newMessageSeparator: '#15b7b7',
            linkColor: '#1c58d9',
            buttonBg: '#1c58d9',
            buttonColor: '#ffffff',
            errorTextColor: '#d24b4e',
            mentionHighlightBg: '#7ff0f0',
            mentionHighlightLink: '#0d6e6e',
            codeTheme: 'github',
        },
        indigo: {
            type: 'Indigo',
            sidebarBg: '#0f1a2e',
            sidebarText: '#ffffff',
            sidebarUnreadText: '#ffffff',
            sidebarTextHoverBg: '#222c3f',
            sidebarTextActiveBorder: '#1279ba',
            sidebarTextActiveColor: '#ffffff',
            sidebarHeaderBg: '#152231',
            sidebarHeaderTextColor: '#dddfe4',
            sidebarTeamBarBg: '#05080f',
            onlineIndicator: '#3db887',
            awayIndicator: '#f5ab00',
            dndIndicator: '#d24b4e',
            mentionBg: '#1c58d9',
            mentionBj: '#1c58d9',
            mentionColor: '#ffffff',
            centerChannelBg: '#0a111f',
            centerChannelColor: '#dddfe4',
            newMessageSeparator: '#81a3ef',
            linkColor: '#5d89ea',
            buttonBg: '#0098FF',
            buttonColor: '#ffffff',
            errorTextColor: '#d24b4e',
            mentionHighlightBg: '#133a91',
            mentionHighlightLink: '#a4f4f4',
            codeTheme: 'solarized-dark',
        },
    } as Record<ThemeKey, Theme>,
    RECENT_EMOJIS: 'recent_emojis',
};

export default Preferences;
