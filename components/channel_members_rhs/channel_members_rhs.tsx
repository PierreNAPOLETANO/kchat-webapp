// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {debounce} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';

import {UserProfile} from '@mattermost/types/users';
import {Channel, ChannelMembership} from '@mattermost/types/channels';
import Constants, {ModalIdentifiers} from 'utils/constants';
import MoreDirectChannels from 'components/more_direct_channels';
import ChannelInviteModal from 'components/channel_invite_modal';
import {ModalData} from 'types/actions';

import {ProfilesInChannelSortBy} from 'mattermost-redux/actions/users';
import {ChannelInvite} from 'packages/types/src/channels';

import AlertBanner from 'components/alert_banner';

import ActionBar from './action_bar';
import Header from './header';
import MemberList from './member_list';
import SearchBar from './search';

const USERS_PER_PAGE = 100;
export interface ChannelMember {
    user: UserProfile;
    membership?: ChannelMembership;
    status?: string;
    displayName: string;
}

const MembersContainer = styled.div`
    flex: 1 1 auto;
    padding: 0 4px 16px;
`;

export interface Props {
    channel: Channel;
    currentUserIsChannelAdmin: boolean;
    membersCount: number;
    searchTerms: string;
    canGoBack: boolean;
    teamUrl: string;
    channelMembers: ChannelMember[];
    canManageMembers: boolean;
    editing: boolean;
    pendingGuests: ChannelInvite[];

    actions: {
        openModal: <P>(modalData: ModalData<P>) => void;
        openDirectChannelToUserId: (userId: string) => Promise<{ data: Channel }>;
        closeRightHandSide: () => void;
        goBack: () => void;
        setChannelMembersRhsSearchTerm: (terms: string) => void;
        loadProfilesAndReloadChannelMembersAll: (membersCount: number, perParge: number, channelId: string) => void;
        // loadProfilesAndReloadChannelMembers: (page: number, perParge: number, channelId: string, sort: string) => void;
        loadMyChannelMemberAndRole: (channelId: string) => void;
        setEditChannelMembers: (active: boolean) => void;
        searchProfilesAndChannelMembers: (term: string, options: any) => Promise<{data: UserProfile[]}>;
        loadChannelPendingGuests: (channelId: string) => void;
    };
}

export enum ListItemType {
    Member = 'member',
    FirstSeparator = 'first-separator',
    Separator = 'separator',
}

export interface ListItem {
    type: ListItemType;
    data: ChannelMember | JSX.Element;
}

export default function ChannelMembersRHS({
    channel,
    currentUserIsChannelAdmin,
    searchTerms,
    membersCount,
    canGoBack,
    teamUrl,
    channelMembers,
    canManageMembers,
    editing = false,
    actions,
    pendingGuests,
}: Props) {
    const history = useHistory();

    const [list, setList] = useState<ListItem[]>([]);

    const [page, setPage] = useState(0);
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);
    const {formatMessage} = useIntl();

    const searching = searchTerms !== '';

    const isDefaultChannel = channel.name === Constants.DEFAULT_CHANNEL;

    // show search if there's more than 20 or if the user have an active search.
    const showSearch = searching || membersCount >= 20;

    useEffect(() => {
        return () => {
            actions.setChannelMembersRhsSearchTerm('');
        };
    }, []);

    useEffect(() => {
        const listcp: ListItem[] = [];
        let memberDone = false;
        let guestDone = false;

        for (let i = 0; i < channelMembers.length; i++) {
            const member = channelMembers[i];
            if (listcp.length === 0) {
                let text = null;
                if (member.membership?.scheme_admin === true) {
                    text = (
                        <FormattedMessage
                            id='channel_members_rhs.list.channel_admin_title'
                            defaultMessage='CHANNEL ADMINS'
                        />
                    );
                } else if (member.membership?.scheme_user === true) {
                    text = (
                        <FormattedMessage
                            id='channel_members_rhs.list.channel_members_title'
                            defaultMessage='MEMBERS'
                        />
                    );
                    memberDone = true;
                } else {
                    text = (
                        <FormattedMessage
                            id='channel_members_rhs.list.channel_guests_title'
                            defaultMessage='GUESTS'
                        />
                    );
                    guestDone = true;
                }

                listcp.push({
                    type: ListItemType.FirstSeparator,
                    data: <FirstMemberListSeparator>{text}</FirstMemberListSeparator>,
                });
            } else if (member.membership?.scheme_admin === false) {
                if (!memberDone && member.membership?.scheme_user === true) {
                    listcp.push({
                        type: ListItemType.Separator,
                        data: <MemberListSeparator>
                            <FormattedMessage
                                id='channel_members_rhs.list.channel_members_title'
                                defaultMessage='MEMBERS'
                            />
                        </MemberListSeparator>,
                    });
                    memberDone = true;
                } else if (!guestDone && member.membership?.scheme_guest === true) {
                    listcp.push({
                        type: ListItemType.Separator,
                        data: <MemberListSeparator>
                            <FormattedMessage
                                id='channel_members_rhs.list.channel_guests_title'
                                defaultMessage='GUESTS'
                            />
                        </MemberListSeparator>,
                    });
                    guestDone = true;
                }
            }
            listcp.push({type: ListItemType.Member, data: member});
        }

        if (pendingGuests) {
            const guests = [...pendingGuests];
            guests.sort((a, b) => {
                if (a.email) {
                    return a.email.localeCompare(b.email);
                }
                return 1;
            });
            for (let i = 0; i < guests.length; i++) {
                const guest = guests[i];
                if (i === 0) {
                    listcp.push({
                        type: ListItemType.Separator,
                        data: <MemberListSeparator>{(
                            <FormattedMessage
                                id='channel_members_rhs.list.channel_pendings_title'
                                defaultMessage='PENDINGS'
                            />
                        )}</MemberListSeparator>,
                    });
                }
                listcp.push({type: ListItemType.Member,
                    data: {
                        user: guest,
                        membership: {},
                        status: guest.status,
                        displayName: guest.email,
                    },
                });
            }
        }

        setList(listcp);
    }, [channelMembers]);

    useEffect(() => {
        if (channel.type === Constants.DM_CHANNEL) {
            let rhsAction = actions.closeRightHandSide;
            if (canGoBack) {
                rhsAction = actions.goBack;
            }
            rhsAction();
            return;
        }

        setPage(0);
        setIsNextPageLoading(false);
        actions.setChannelMembersRhsSearchTerm('');
        actions.loadProfilesAndReloadChannelMembersAll(membersCount, USERS_PER_PAGE, channel.id, ProfilesInChannelSortBy.Admin);

        // TODO: mattermost
        // actions.loadProfilesAndReloadChannelMembers(0, USERS_PER_PAGE, channel.id, ProfilesInChannelSortBy.Admin);
        actions.loadMyChannelMemberAndRole(channel.id);
        actions.loadChannelPendingGuests(channel.id);
    }, [channel.id, channel.type]);

    const setSearchTerms = async (terms: string) => {
        actions.setChannelMembersRhsSearchTerm(terms);
    };

    const doSearch = useCallback(debounce(async (terms: string) => {
        await actions.searchProfilesAndChannelMembers(terms, {in_team_id: channel.team_id, in_channel_id: channel.id});
    }, Constants.SEARCH_TIMEOUT_MILLISECONDS), [actions.searchProfilesAndChannelMembers]);

    useEffect(() => {
        if (searchTerms) {
            doSearch(searchTerms);
        }
    }, [searchTerms]);

    const inviteMembers = () => {
        if (channel.type === Constants.GM_CHANNEL) {
            return actions.openModal({
                modalId: ModalIdentifiers.CREATE_DM_CHANNEL,
                dialogType: MoreDirectChannels,
                dialogProps: {isExistingChannel: true},
            });
        }

        return actions.openModal({
            modalId: ModalIdentifiers.CHANNEL_INVITE,
            dialogType: ChannelInviteModal,
            dialogProps: {channel},
        });
    };

    const openDirectMessage = async (user: UserProfile) => {
        // we first prepare the DM channel...
        await actions.openDirectChannelToUserId(user.id);

        // ... and then redirect to it
        history.push(teamUrl + '/messages/@' + user.username);

        await actions.closeRightHandSide();
    };

    const loadMore = async () => {
        setIsNextPageLoading(true);

        await actions.loadProfilesAndReloadChannelMembers(page + 1, USERS_PER_PAGE, channel.id, ProfilesInChannelSortBy.Admin);
        setPage(page + 1);

        setIsNextPageLoading(false);
    };

    return (
        <div
            id='rhsContainer'
            className='sidebar-right__body'
        >

            <Header
                channel={channel}
                canGoBack={true}
                onClose={actions.closeRightHandSide}
                goBack={actions.goBack}
            />

            <ActionBar
                channelType={channel.type}
                membersCount={membersCount}
                canManageMembers={canManageMembers}
                editing={editing}
                actions={{
                    startEditing: () => actions.setEditChannelMembers(true),
                    stopEditing: () => actions.setEditChannelMembers(false),
                    inviteMembers,
                }}
            />

            {/* Users with user management permissions have special restrictions in the default channel */}
            {(editing && isDefaultChannel && !currentUserIsChannelAdmin) && (
                <AlertContainer>
                    <AlertBanner
                        mode='info'
                        variant='app'
                        message={formatMessage({
                            id: 'channel_members_rhs.default_channel_moderation_restrictions',
                            defaultMessage: 'In this channel, you can only remove guests. Only <link>channel admins</link> can manage other members.',
                        }, {
                            link: (msg: React.ReactNode) => (
                                <a
                                    href='https://docs.mattermost.com/welcome/about-user-roles.html#channel-admin'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    {msg}
                                </a>
                            ),
                        })}
                    />
                </AlertContainer>
            )}

            {showSearch && (
                <SearchBar
                    terms={searchTerms}
                    onInput={setSearchTerms}
                />
            )}

            <MembersContainer>
                {channelMembers.length > 0 && (
                    <MemberList
                        searchTerms={searchTerms}
                        members={list}
                        editing={editing}
                        channel={channel}
                        actions={{openDirectMessage, loadMore}}
                        hasNextPage={channelMembers.length < membersCount}
                        isNextPageLoading={isNextPageLoading}
                    />
                )}
            </MembersContainer>
        </div>
    );
}

const MemberListSeparator = styled.div`
    font-weight: 600;
    font-size: 12px;
    line-height: 28px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    padding: 0px 12px;
    color: rgba(var(--center-channel-color-rgb), 0.56);
    margin-top: 16px;
`;

const FirstMemberListSeparator = styled(MemberListSeparator)`
    margin-top: 0px;
`;

const AlertContainer = styled.div`
    padding: 0 20px 15px;
`;
