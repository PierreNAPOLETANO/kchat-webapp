// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import {GlobalState} from 'types/store';

import LinkingLandingPage from './linking_landing_page';

function mapStateToProps(state: GlobalState) {
    const config = getConfig(state);

    return {
        desktopAppLink: config.AppDownloadLink,
        iosAppLink: 'https://apps.apple.com/app/infomaniak-kchat/id6443845553',
        androidAppLink: 'https://play.google.com/store/apps/details?id=com.infomaniak.chat',
        defaultTheme: getTheme(state),
        siteUrl: config.SiteURL,
        siteName: config.SiteName,
    };
}

export default connect(mapStateToProps)(LinkingLandingPage);
