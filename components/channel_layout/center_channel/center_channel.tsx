// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import classNames from 'classnames';

import {ActionFunc} from 'mattermost-redux/types/actions';

import LoadingScreen from 'components/loading_screen';
import PermalinkView from 'components/permalink_view';
import ChannelHeaderMobile from 'components/channel_header_mobile';
import ChannelIdentifierRouter from 'components/channel_layout/channel_identifier_router';
import PlaybookRunner from 'components/channel_layout/playbook_runner';
import NextStepsView from 'components/next_steps_view';
import ActivityAndInsights from 'components/activity_and_insights/activity_and_insights';
import {makeAsyncComponent} from 'components/async_load';
import MeetWidget from 'components/kmeet_conference/call_widget';
import RenderIFrame from 'components/kmeet_conference/iframe';
import {isDesktopApp} from 'utils/user_agent';
import {Channel} from 'mattermost-redux/types/channels';

const LazyGlobalThreads = makeAsyncComponent(
    'LazyGlobalThreads',
    React.lazy(() => import('components/threading/global_threads')),
    (
        <div className='app__content'>
            <LoadingScreen/>
        </div>
    ),
);

type Props = {
    match: {
        url: string;
    };
    location: {
        pathname: string;
    };
    lastChannelPath: string;
    lhsOpen: boolean;
    rhsOpen: boolean;
    rhsMenuOpen: boolean;
    isCollapsedThreadsEnabled: boolean;
    currentUserId: string;
    enableTipsViewRoute: boolean;
    callChannel: Channel;
    callExpandedView: boolean;
    insightsAreEnabled: boolean;
    actions: {
        getProfiles: (page?: number, perPage?: number, options?: Record<string, string | boolean>) => ActionFunc;
    };
};

type State = {
    returnTo: string;
    lastReturnTo: string;
};

export default class CenterChannel extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            returnTo: '',
            lastReturnTo: '',
        };
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (prevState.lastReturnTo !== nextProps.location.pathname && nextProps.location.pathname.includes('/pl/')) {
            return {
                lastReturnTo: nextProps.location.pathname,
                returnTo: prevState.lastReturnTo,
            };
        }
        return {lastReturnTo: nextProps.location.pathname};
    }

    async componentDidMount() {
        const {actions} = this.props;
        await actions.getProfiles();
    }

    render() {
        const {lastChannelPath, isCollapsedThreadsEnabled, enableTipsViewRoute, insightsAreEnabled} = this.props;
        const url = this.props.match.url;

        return (
            <React.Fragment>
                {this.props.callChannel && (
                    <React.Fragment>
                        {/* {isDesktopApp() && <RenderIFrame/>} */}
                        <MeetWidget/>
                    </React.Fragment>
                )}
                <div
                    key='inner-wrap'
                    className={classNames('inner-wrap', 'channel__wrap', {
                        'move--right': this.props.lhsOpen,
                        'move--left': this.props.rhsOpen,
                        'move--left-small': this.props.rhsMenuOpen,
                    })}
                >
                    <div className='row header'>
                        <div id='navbar_wrapper'>
                            <ChannelHeaderMobile/>
                        </div>
                    </div>
                    {/* <MeetWidget>
                    <CallIFrame/>
                </MeetWidget> */}
                    <div className='row main'>
                        <Switch>
                            <Route
                                path={`${url}/pl/:postid`}
                                render={(props) => (
                                    <PermalinkView
                                        {...props}
                                        returnTo={this.state.returnTo}
                                    />
                                )}
                            />
                            {/* <Route
                                path='/:team/:path(channels|messages)/:identifier/call'
                                render={() => (
                                    <React.Fragment>
                                        <RenderInWindow>
                                            <CallIFrame/>
                                        </RenderInWindow>
                                        <MeetWidget/>
                                    </React.Fragment>
                                )}
                            /> */}
                            <Route
                                path='/:team/:path(channels|messages)/:identifier/:postid?'
                                component={ChannelIdentifierRouter}
                            />
                            <Route
                                path='/:team/_playbooks/:playbookId/run'
                            >
                                <PlaybookRunner/>
                            </Route>
                            {enableTipsViewRoute ? (
                                <Route
                                    path='/:team/tips'
                                    component={NextStepsView}
                                />

                            ) : null}
                            {isCollapsedThreadsEnabled ? (
                                <Route
                                    path='/:team/threads/:threadIdentifier?'
                                    component={LazyGlobalThreads}
                                />
                            ) : null}
                            {insightsAreEnabled ? (
                                <Route
                                    path='/:team/activity-and-insights'
                                    component={ActivityAndInsights}
                                />
                            ) : null}
                            <Redirect to={lastChannelPath}/>
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
