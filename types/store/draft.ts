// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {FileInfo} from '@mattermost/types/files';
import {PostPriority} from '@mattermost/types/posts';

export type DraftInfo = {
    id: string;
    type: 'channel' | 'thread';
}

export type PostDraft = {
    id?: string;
    message: string;
    fileInfos: FileInfo[];
    uploadsInProgress: string[];
    props?: any;
    caretPosition?: number;
    channelId: string;
    rootId: string;
    createAt: number;
    updateAt: number;
    show?: boolean;
    remote?: boolean;
    timestamp?: number;
    metadata?: {
        priority?: {
            priority: PostPriority|'';
            requested_ack?: boolean;
            persistent_notifications?: boolean;
        };
    };
};
