// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useMemo} from 'react';

import {CloudUsage} from '@mattermost/types/cloud';

import useGetUsage from './useGetUsage';
import useGetLimits from './useGetLimits';

// Returns an object of type CloudUsage with the values being the delta between the limit, and the actual usage of this installation.
// A value < 0 means that they are NOT over the limit. A value > 0 means they've exceeded that limit
// 2 teams used, minus 1 team limit = value > 0, limit exceeded
// 10MB files used, minus 1000MB limit = value < 0, limit not exceeded.
// etc.
// withBackupValue will set the limit arbitrarily high in the event that the limit isn't set
export const withBackupValue = (maybeLimit: number | undefined, limitsLoaded: boolean) => (limitsLoaded ? (maybeLimit ?? Number.MAX_VALUE) : Number.MAX_VALUE);

export default function useGetUsageDeltas(): CloudUsage {
    const usage = useGetUsage();
    const [limits, limitsLoaded] = useGetLimits();

    const usageDelta = useMemo(() => {
        return (
            {
                storage: usage.storage - withBackupValue(limits.storage, limitsLoaded),
                public_channels: usage.public_channels - withBackupValue(limits.public_channels, limitsLoaded),
                private_channels: usage.private_channels - withBackupValue(limits.private_channels, limitsLoaded),
                guests: usage.guests - withBackupValue(limits.guests, limitsLoaded),
                pending_guests: -usage.pending_guests,
                members: usage.members - withBackupValue(limits.members, limitsLoaded),
                usageLoaded: usage.usageLoaded,
                files: {
                    totalStorage: usage.files.totalStorage - withBackupValue(limits.files?.total_storage, limitsLoaded),
                    totalStorageLoaded: usage.files.totalStorageLoaded,
                },
                messages: {
                    history: usage.messages.history - withBackupValue(limits.messages?.history, limitsLoaded),
                    historyLoaded: usage.messages.historyLoaded,
                },
                teams: {
                    active: usage.teams.active - withBackupValue(limits.teams?.active, limitsLoaded),

                    // cloudArchived doesn't count against usage, but we pass the value along for convenience
                    cloudArchived: usage.teams.cloudArchived,
                    teamsLoaded: usage.teams.teamsLoaded,
                },
            }
        );
    }, [usage, limits, limitsLoaded]);

    return usageDelta;
}
