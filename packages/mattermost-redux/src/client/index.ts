// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {
    Client4 as ClientClass4,
    DEFAULT_LIMIT_AFTER,
    DEFAULT_LIMIT_BEFORE,
} from '@mattermost/client';

declare const GIT_RELEASE: string;

const Client4 = new ClientClass4();
Client4.setWebappVersion(GIT_RELEASE);

export {
    Client4,
    DEFAULT_LIMIT_AFTER,
    DEFAULT_LIMIT_BEFORE,
};
