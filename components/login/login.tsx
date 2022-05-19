// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable no-console */

/* eslint-disable max-lines */
import classNames from 'classnames';

import crypto from 'crypto';

import React, {useEffect, useRef, useState} from 'react';

// import {useIntl} from 'react-intl';

// import {useDispatch, useSelector} from 'react-redux';
import {useSelector} from 'react-redux';

import {Link, useHistory, useLocation} from 'react-router-dom';

import * as GlobalActions from 'actions/global_actions';
import {redirectUserToDefaultTeam} from 'actions/global_actions';
import LoadingIk from 'components/loading_ik';
import LoadingScreen from 'components/loading_screen';

import {Client4} from 'mattermost-redux/client';
import {RequestStatus} from 'mattermost-redux/constants';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getUseCaseOnboarding} from 'mattermost-redux/selectors/entities/preferences';
import {getMyTeamMember, getTeamByName} from 'mattermost-redux/selectors/entities/teams';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

// import {DispatchFunc} from 'mattermost-redux/types/actions';
import {Team} from 'mattermost-redux/types/teams';

import LocalStorageStore from 'stores/local_storage_store';
import {GlobalState} from 'types/store';
import Constants from 'utils/constants';
import {IKConstants} from 'utils/constants-ik';
import {isDesktopApp} from 'utils/user_agent';
import {setCSRFFromCookie} from 'utils/utils';
import './login.scss';

type ExternalLoginButtonType = {
    id: string;
    url: string;
    icon: React.ReactNode;
    label: string;
    style?: React.CSSProperties;
};

export const ExternalLoginButton = ({
    id,
    url,
    icon,
    label,
    style,
}: ExternalLoginButtonType) => (
    <Link
        id={id}
        className={classNames('login-body-card-form-login-option', id)}
        to={url}
        style={style}
    >
        {icon}
        <span className='login-body-card-form-login-option-label'>
            {label}
        </span>
    </Link>
);

const Login = () => {
    // const {formatMessage} = useIntl();
    // const dispatch = useDispatch<DispatchFunc>();
    const history = useHistory();
    const {pathname, search, hash, code} = useLocation();
console.log(useLocation())
    // Store token infos in localStorage
    const storeTokenResponse = (response: { expires_in?: any; access_token?: any; refresh_token?: any }) => {
        // TODO: store in redux
        const d = new Date();
        d.setSeconds(d.getSeconds() + parseInt(response.expires_in, 10));
        localStorage.setItem('IKToken', response.access_token);
        localStorage.setItem('IKRefreshToken', response.refresh_token);
        localStorage.setItem('IKTokenExpire', parseInt(d.getTime() / 1000, 10));
        Client4.setToken(response.access_token);
        Client4.setCSRF(response.access_token);
        Client4.setAuthHeader = true;
    };

    const getCodeVerifier = () => {
        const ramdonByte = crypto.randomBytes(33);
        const hash =
                   crypto.createHash('sha256').update(ramdonByte).digest();
        return hash.toString('base64').
            replace(/\+/g, '-').
            replace(/\//g, '_').
            replace(/[=]/g, '');
    };

    const generateCodeChallenge = async (codeVerifier: any) => {
        const hash =
               crypto.createHash('sha256').update(codeVerifier).digest();
        return hash.toString('base64').
            replace(/\+/g, '-').
            replace(/\//g, '_').
            replace(/[=]/g, '');
    };

    const searchParam = new URLSearchParams(search);
    const extraParam = searchParam.get('extra');
    const emailParam = searchParam.get('email');

    const {
        ExperimentalPrimaryTeam,
    } = useSelector(getConfig);
    const initializing = useSelector((state: GlobalState) => state.requests.users.logout.status === RequestStatus.SUCCESS || !state.storage.initialized);
    const currentUser = useSelector(getCurrentUser);
    const experimentalPrimaryTeam = useSelector((state: GlobalState) => (ExperimentalPrimaryTeam ? getTeamByName(state, ExperimentalPrimaryTeam) : undefined));
    const experimentalPrimaryTeamMember = useSelector((state: GlobalState) => getMyTeamMember(state, experimentalPrimaryTeam?.id ?? ''));
    const useCaseOnboarding = useSelector(getUseCaseOnboarding);

    const passwordInput = useRef<HTMLInputElement>(null);
    const closeSessionExpiredNotification = useRef<() => void>();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            redirectUserToDefaultTeam();
            return;
        }

        if (isDesktopApp()) {
            const loginCode = (new URLSearchParams(search)).get('code')
console.log(loginCode)
            const token = localStorage.getItem('IKToken');
            const refreshToken = localStorage.getItem('IKRefreshToken');
            const tokenExpire = localStorage.getItem('IKTokenExpire');

            if (token && tokenExpire && !(tokenExpire <= parseInt(Date.now() / 1000, 10))) {
                Client4.setAuthHeader = true;
                Client4.setToken(token);
                Client4.setCSRF(token);
                LocalStorageStore.setWasLoggedIn(true);
                GlobalActions.redirectUserToDefaultTeam();
            }

            // If need to refresh the token
            // if (tokenExpire && tokenExpire <= Date.now()) {
            //     if (!refreshToken) return

            //     this.setState({loading: true})
            //     Client4.refreshIKLoginToken(
            //         refreshToken,
            //         "https://login.devd281.dev.infomaniak.ch",
            //         "A7376A6D-9A79-4B06-A837-7D92DB93965B"
            //     ).then((resp) => {
            //         return
            //         this.storeTokenResponse(resp)
            //         this.finishSignin();
            //     }).catch((error) => {
            //         console.log(error)
            //         return;
            //     }
            //     ).finally(this.setState({loading: false}))
            //     return;
            // }

            // Receive login code from login redirect
            if (hash) {
                const hash2Obj = {};
                // eslint-disable-next-line array-callback-return
                hash.substring(1).split('&').map((hk) => {
                    const temp = hk.split('=');
                    hash2Obj[temp[0]] = temp[1];
                });
                storeTokenResponse(hash2Obj);
                localStorage.removeItem('challenge');
                LocalStorageStore.setWasLoggedIn(true);

                // location.reload();

                finishSignin();

                return;

                //     const challenge = JSON.parse(localStorage.getItem('challenge'));
                //     this.setState({ loading: true })
                //     return
                // //    Get token
                //     Client4.getIKLoginToken(
                //         loginCode,
                //         challenge?.challenge,
                //         challenge?.verifier,
                //         "https://login.devd281.dev.infomaniak.ch",
                //         "A7376A6D-9A79-4B06-A837-7D92DB93965B"
                //     ).then((resp) => {
                //         this.storeTokenResponse(resp)
                //         localStorage.removeItem('challenge')
                //         this.finishSignin();
                //     }).catch((error) => {
                //         console.log(error)
                //     }
                //     ).finally(this.setState({ loading: false }))

                //     localStorage.removeItem('challenge');
                //     return
            }

            if (loginCode) {
                // const hash2Obj = {};
                // // eslint-disable-next-line array-callback-return
                // hash.substring(1).split('&').map((hk) => {
                //     const temp = hk.split('=');
                //     hash2Obj[temp[0]] = temp[1];
                // });
                // this.storeTokenResponse(hash2Obj);
                // localStorage.removeItem('challenge');
                // LocalStorageStore.setWasLoggedIn(true);

                // // location.reload();

                // this.finishSignin();

                // return;

                const challenge = JSON.parse(localStorage.getItem('challenge'));

                //    Get token
                Client4.getIKLoginToken(
                    loginCode,
                    challenge?.challenge,
                    challenge?.verifier,
                    `${IKConstants.LOGIN_URL}`,
                    `${IKConstants.CLIENT_ID}`,
                ).then((resp) => {
                    console.log("get token", resp);
                    return
                    // this.storeTokenResponse(resp);
                    // localStorage.removeItem('challenge');
                    // this.finishSignin();
                }).catch((error) => {
                    console.log(error);
                },
                ).finally(console.log("finally"));

            //     localStorage.removeItem('challenge');
            //     return
            }

            if (!token || !refreshToken || !tokenExpire || (tokenExpire && tokenExpire <= parseInt(Date.now() / 1000, 10))) {
                // eslint-disable-next-line react/no-did-mount-set-state
                setLoading(true);
                const codeVerifier = getCodeVerifier();
                let codeChallenge = '';
                generateCodeChallenge(codeVerifier).then((challenge) => {
                    codeChallenge = challenge;

                    // TODO: store in redux instead of localstorage
                    localStorage.setItem('challenge', JSON.stringify({verifier: codeVerifier, challenge: codeChallenge}));

                    // TODO: add env for login url and/or current server
                    window.location.assign(`${IKConstants.LOGIN_URL}authorize?access_type=offline&code_challenge=${codeChallenge}&code_challenge_method=S256&client_id=${IKConstants.CLIENT_ID}&response_type=code&redirect_uri=ktalk://auth-desktop`);
                }).catch(() => {
                    console.log('Error redirect');

                    // Ignore the failure
                    // eslint-disable-next-line react/no-did-mount-set-state
                }).finally(() => setLoading(false));
            }
        }

        if (extraParam === Constants.SIGNIN_VERIFIED && emailParam) {
            passwordInput.current?.focus();
        }

        // Determine if the user was unexpectedly logged out.
        if (LocalStorageStore.getWasLoggedIn()) {
            if (extraParam === Constants.SIGNIN_CHANGE) {
                // Assume that if the user triggered a sign in change, it was intended to logout.
                // We can't preflight this, since in some flows it's the server that invalidates
                // our session after we use it to complete the sign in change.
                LocalStorageStore.setWasLoggedIn(false);
            } else {
                // Although the authority remains the local sessionExpired bit on the state, set this
                // extra field in the querystring to signal the desktop app.
                const newSearchParam = new URLSearchParams(search);
                newSearchParam.set('extra', Constants.SESSION_EXPIRED);
                history.replace(`${pathname}?${newSearchParam}`);
            }
        }
    }, []);

    useEffect(() => {
        return () => {
            if (closeSessionExpiredNotification!.current) {
                closeSessionExpiredNotification.current();
                closeSessionExpiredNotification.current = undefined;
            }
        };
    });

    if (initializing) {
        return (<LoadingScreen/>);
    }

    const finishSignin = (team?: Team) => {
        const query = new URLSearchParams(search);
        const redirectTo = query.get('redirect_to');

        setCSRFFromCookie();

        // Record a successful login to local storage. If an unintentional logout occurs, e.g.
        // via session expiration, this bit won't get reset and we can notify the user as such.
        LocalStorageStore.setWasLoggedIn(true);
        if (redirectTo && redirectTo.match(/^\/([^/]|$)/)) {
            history.push(redirectTo);
        } else if (team) {
            history.push(`/${team.name}`);
        } else if (experimentalPrimaryTeamMember.team_id) {
            // Only set experimental team if user is on that team
            history.push(`/${ExperimentalPrimaryTeam}`);
        } else if (useCaseOnboarding) {
            // need info about whether admin or not,
            // and whether admin has already completed
            // first tiem onboarding. Instead of fetching and orchestrating that here,
            // let the default root component handle it.
            history.push('/');
        } else {
            redirectUserToDefaultTeam();
        }
    };

    const getContent = () => {
        return (<LoadingIk/>);
    };

    return (
        <div className='login-body'>
            <div className='login-body-content'>
                {getContent()}
            </div>
        </div>
    );
};

export default Login;
