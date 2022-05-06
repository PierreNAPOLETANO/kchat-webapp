// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {combineReducers} from 'redux';

import admin from './admin';
import announcementBar from './announcement_bar';
import browser from './browser';
import channel from './channel';
import rhs from './rhs';
import rhsSuppressed from './rhs_suppressed';
import posts from './posts';
import modals from './modals';
import emoji from './emoji';
import i18n from './i18n';
import ik from './ik';
import lhs from './lhs';
import search from './search';
import notice from './notice';
import system from './system';
import channelSelectorModal from './channel_selector_modal';
import settings from './settings';
import marketplace from './marketplace';
import channelSidebar from './channel_sidebar';
import productMenu from './product_menu';
import textbox from './textbox';
import nextSteps from './next_steps';
import statusDropdown from './status_dropdown';
import threads from './threads';
import calls from './calls';

export default combineReducers({
    admin,
    announcementBar,
    browser,
    channel,
    rhs,
    rhsSuppressed,
    posts,
    modals,
    emoji,
    i18n,
    ik,
    lhs,
    search,
    notice,
    system,
    channelSelectorModal,
    settings,
    marketplace,
    textbox,
    channelSidebar,
    nextSteps,
    statusDropdown,
    threads,
    productMenu,
    calls,
});
