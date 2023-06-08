// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {batchActions} from 'redux-batched-actions';

import {ActionFunc, DispatchFunc, GetStateFunc} from 'mattermost-redux/types/actions';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {syncedDraftsAreAllowedAndEnabled} from 'mattermost-redux/selectors/entities/preferences';
import {Client4} from 'mattermost-redux/client';

import {setGlobalItem} from 'actions/storage';
import type {GlobalState} from 'types/store';
import {PostDraft} from 'types/store/draft';
import {getGlobalItem} from 'selectors/storage';
import {makeGetDrafts} from 'selectors/drafts';

import {StoragePrefixes} from 'utils/constants';

import type {Draft as ServerDraft} from '@mattermost/types/drafts';
import type {UserProfile} from '@mattermost/types/users';
import {PostMetadata, PostPriorityMetadata} from '@mattermost/types/posts';
import {FileInfo} from '@mattermost/types/files';
import {PreferenceType} from '@mattermost/types/preferences';
import {savePreferences} from 'mattermost-redux/actions/preferences';
import Preferences from 'mattermost-redux/constants/preferences';

type Draft = {
    key: keyof GlobalState['storage']['storage'];
    value: PostDraft;
    timestamp: Date;
}

/**
 * Gets drafts stored on the server and reconciles them with any locally stored drafts.
 * @param teamId Only drafts for the given teamId will be fetched.
 */
export function getDrafts(teamId: string) {
    const getLocalDrafts = makeGetDrafts(false);
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState() as GlobalState;

        let serverDrafts: Draft[] = [];
        try {
            serverDrafts = (await Client4.getUserDrafts(teamId)).map((draft) => transformServerDraft(draft));
        } catch (error) {
            return {data: false, error};
        }

        const localDrafts = getLocalDrafts(state);
        const drafts = [...serverDrafts, ...localDrafts];

        // Reconcile drafts and only keep the latest version of a draft.
        const draftsMap = new Map(drafts.map((draft) => [draft.key, draft]));
        drafts.forEach((draft) => {
            const currentDraft = draftsMap.get(draft.key);
            if (currentDraft && draft.timestamp > currentDraft.timestamp) {
                draftsMap.set(draft.key, draft);
            }
        });

        const actions = Array.from(draftsMap).map(([key, draft]) => {
            return setGlobalItem(key, draft.value);
        });

        dispatch(batchActions(actions));
        return {data: true};
    };
}

export function removeDraft(key: string) {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState() as GlobalState;
        const draftId = getGlobalItem(state, key, {}).id;

        dispatch(setGlobalItem(key, {message: '', fileInfos: [], uploadsInProgress: []}));

        if (syncedDraftsAreAllowedAndEnabled(state) && draftId) {
            try {
                await Client4.deleteDraft(draftId);
            } catch (error) {
                return {
                    data: false,
                    error,
                };
            }
        }
        return {data: true};
    };
}

export function updateDraft(key: string, value: PostDraft|null, rootId = '', save = false) {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState() as GlobalState;
        let updatedValue: PostDraft|null = null;
        if (value) {
            const timestamp = new Date().getTime();
            const data = getGlobalItem(state, key, {});
            updatedValue = {
                ...value,
                createAt: data.createAt || timestamp,
                updateAt: timestamp,
                remote: false,
            };
        }

        if (syncedDraftsAreAllowedAndEnabled(state) && save && updatedValue) {
            const userId = getCurrentUserId(state);
            try {
                const {id} = await upsertDraft(updatedValue, userId, rootId);
                updatedValue.id = id;
            } catch (error) {
                return {data: false, error};
            }
        }
        dispatch(setGlobalItem(key, updatedValue));
        return {data: true};
    };
}

export function upsertScheduleDraft(key: string, value: PostDraft, rootId = '') {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState() as GlobalState;
        if (!syncedDraftsAreAllowedAndEnabled(state)) {
            return {error: new Error('Drafts are not allowed on the current server')};
        }
        const userId = getCurrentUserId(state);

        dispatch(setGlobalItem(key, {message: '', fileInfos: [], uploadsInProgress: []}));

        try {
            const {id} = await upsertDraft(value, userId, rootId);
            dispatch(setGlobalItem(`${key}_${id}`, {
                ...value,
                id,
            }));
        } catch (error) {
            return {error};
        }
        return {data: true};
    };
}

function upsertDraft(draft: PostDraft, userId: UserProfile['id'], rootId = '') {
    const fileIds = draft.fileInfos.map((file) => file.id);
    const newDraft = {
        id: draft.id,
        create_at: draft.createAt || 0,
        update_at: draft.updateAt || 0,
        delete_at: 0,
        user_id: userId,
        channel_id: draft.channelId,
        root_id: draft.rootId || rootId,
        message: draft.message,
        props: draft.props,
        file_ids: fileIds,
        timestamp: draft.timestamp,
        priority: draft.metadata?.priority as PostPriorityMetadata,
    };

    if (newDraft.id) {
        return Client4.updateDraft(newDraft as ServerDraft);
    }

    return Client4.createDraft(newDraft);
}

export function setDraftsTourTipPreference(initializationState: Record<string, boolean>): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState();
        const currentUserId = getCurrentUserId(state);
        const preference: PreferenceType = {
            user_id: currentUserId,
            category: Preferences.CATEGORY_DRAFTS,
            name: Preferences.DRAFTS_TOUR_TIP_SHOWED,
            value: JSON.stringify(initializationState),
        };
        await dispatch(savePreferences(currentUserId, [preference]));
        return {data: true};
    };
}

export function transformServerDraft(draft: ServerDraft): Draft {
    let key: Draft['key'] = `${StoragePrefixes.DRAFT}${draft.channel_id}`;

    if (draft.root_id !== '') {
        key = `${StoragePrefixes.COMMENT_DRAFT}${draft.root_id}`;
    }

    if (draft.timestamp) {
        key += `_${draft.id}`;
    }

    let fileInfos: FileInfo[] = [];
    if (draft.metadata?.files) {
        fileInfos = draft.metadata.files;
    }

    const metadata = (draft.metadata || {}) as PostMetadata;
    if (draft.priority) {
        metadata.priority = draft.priority;
    }

    return {
        key,
        timestamp: new Date(draft.update_at),
        value: {
            id: draft.id,
            message: draft.message,
            timestamp: draft.timestamp,
            fileInfos,
            props: draft.props,
            uploadsInProgress: [],
            channelId: draft.channel_id,
            rootId: draft.root_id,
            createAt: draft.create_at,
            updateAt: draft.update_at,
            metadata,
            show: true,
        },
    };
}
