// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import './entry.js';

import React from 'react';
import ReactDOM from 'react-dom';

import {logError} from 'mattermost-redux/actions/errors';

// Import our styles
import 'sass/styles.scss';
import 'katex/dist/katex.min.css';

import '@mattermost/compass-icons/css/compass-icons.css';

import {isDevMode, setCSRFFromCookie} from 'utils/utils';
import {AnnouncementBarTypes} from 'utils/constants';
import store from 'stores/redux_store.jsx';
import App from 'components/app';
import sentry from 'utils/sentry';

sentry({SENTRY_DSN: 'https://75ce8efdf6ed465d89ae9990c403a72d@sentry.infomaniak.com/53'});

// This is for anything that needs to be done for ALL react components.
// This runs before we start to render anything.
function preRenderSetup(callwhendone) {
    window.onerror = (msg, url, line, column, stack) => {
        if (msg === 'ResizeObserver loop limit exceeded') {
            return;
        }

        let displayable = false;
        if (isDevMode()) {
            displayable = true;
        }

        store.dispatch(
            logError({
                type: AnnouncementBarTypes.DEVELOPER,
                message: 'A JavaScript error in the webapp client has occurred. (msg: ' + msg + ', row: ' + line + ', col: ' + column + ').',
                stack,
                url,
            },
            displayable,
            true,
            ),
        );
    };
    setCSRFFromCookie();
    callwhendone();
}

function renderRootComponent() {
    ReactDOM.render((
        <App/>
    ),
    document.getElementById('root'));
}

/**
 * Adds a function to be invoked onload appended to any existing onload
 * event handlers.
 *
 * @param   {function} fn onload event handler
 *
 */
function appendOnLoadEvent(fn) {
    if (window.attachEvent) {
        window.attachEvent('onload', fn);
    } else if (window.onload) {
        const curronload = window.onload;
        window.onload = (evt) => {
            curronload(evt);
            fn(evt);
        };
    } else {
        window.onload = fn;
    }
}

appendOnLoadEvent(() => {
    // Do the pre-render setup and call renderRootComponent when done
    preRenderSetup(renderRootComponent);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/static/service-worker.js', {scope: '/'}).then((registration) => {
            console.log('SW registered: ', registration);
        }).catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
        });
    }
});
