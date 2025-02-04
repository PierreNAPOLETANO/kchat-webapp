// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {closeRightHandSide, selectPostById} from 'actions/views/rhs';
import {getSelectedPostId, getIsRhsOpen} from 'selectors/rhs';

import BotTag from 'components/widgets/tag/bot_tag';

import messageHtmlToComponent from 'utils/message_html_to_component';
import {formatText} from 'utils/text_formatting';
import {getHistory} from 'utils/browser_history';

import {openModal} from 'actions/views/modals';
import {ModalIdentifiers} from 'utils/constants';
import {useWebSocket, useWebSocketClient, WebSocketContext} from 'utils/use_websocket';
import {imageURLForUser,registerDevice} from 'utils/utils';

import ChannelInviteModal from 'components/channel_invite_modal';
import ChannelMembersModal from 'components/channel_members_modal';
import PurchaseModal from 'components/purchase_modal';
import {useNotifyAdmin} from 'components/notify_admin_cta/notify_admin_cta';
import Timestamp from 'components/timestamp';
import Avatar from 'components/widgets/users/avatar';

import Textbox from './textbox';

// The following import has intentional side effects. Do not remove without research.
import {openInteractiveDialog} from './interactive_dialog';

// Common libraries exposed on window for plugins to use as Webpack externals.
window.React = require('react');
window.ReactDOM = require('react-dom');
window.ReactIntl = require('react-intl');
window.Redux = require('redux');
window.ReactRedux = require('react-redux');
window.ReactBootstrap = require('react-bootstrap');
window.ReactRouterDom = require('react-router-dom');
window.PropTypes = require('prop-types');
window.Luxon = require('luxon');
window.StyledComponents = require('styled-components');

// Functions exposed on window for plugins to use.
window.PostUtils = {
    formatText,
    messageHtmlToComponent: (html, ...otherArgs) => {
        // Previously, this function took an extra isRHS argument as the second parameter. For backwards compatibility,
        // support calling this as either messageHtmlToComponent(html, options) or messageHtmlToComponent(html, isRhs, options)

        let options;
        if (otherArgs.length === 2) {
            options = otherArgs[1];
        } else if (otherArgs.length === 1 && typeof otherArgs[0] === 'object') {
            options = otherArgs[0];
        }

        return messageHtmlToComponent(html, options);
    },
};
window.openInteractiveDialog = openInteractiveDialog;
window.useNotifyAdmin = useNotifyAdmin;
window.WebappUtils = {
    modals: {openModal, ModalIdentifiers},
};
Object.defineProperty(window.WebappUtils, 'browserHistory', {
    get: () => getHistory(),
});

// Components exposed on window FOR INTERNAL PLUGIN USE ONLY. These components may have breaking changes in the future
// outside of major releases. They will be replaced by common components once that project is more mature and able to
// guarantee better compatibility.
window.Components = {
    Textbox,
    PurchaseModal,
    Timestamp,
    ChannelInviteModal,
    ChannelMembersModal,
    Avatar,
    imageURLForUser,
    registerDevice,
    BotBadge: BotTag,
};

// This is a prototype of the Product API for use by internal plugins only while we transition to the proper architecture
// for them using module federation.
window.ProductApi = {
    useWebSocket,
    useWebSocketClient,
    WebSocketProvider: WebSocketContext,
    closeRhs: closeRightHandSide,
    selectRhsPost: selectPostById,
    getRhsSelectedPostId: getSelectedPostId,
    getIsRhsOpen,
};
