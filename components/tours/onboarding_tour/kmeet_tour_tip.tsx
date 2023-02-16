// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import {useMeasurePunchouts} from '@mattermost/components';

import OnboardingTourTip from './onboarding_tour_tip';

export const KmeetTour = () => {
    const title = (
        <FormattedMessage
            id='onboardingTour.KmeetTourTip.title'
            defaultMessage={'Kmeet'}
        />
    );
    const screen = (
        <FormattedMessage
            id='onboardingTour.KmeetTourTip.content'
            defaultMessage={'Kmeet'}
        />
    );

    const overlayPunchOut = useMeasurePunchouts(['channel-header-kmeet-btn'], []);

    return (
        <OnboardingTourTip
            title={title}
            screen={screen}
            placement='bottom-end'
            width={400}
            overlayPunchOut={overlayPunchOut}
        />
    );
};
