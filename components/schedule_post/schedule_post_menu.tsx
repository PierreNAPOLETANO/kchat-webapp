// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useSelector} from 'react-redux';
import {FormattedDate, FormattedMessage, FormattedTime} from 'react-intl';
import {Fade, MenuProps} from '@mui/material';

import {getBool} from 'mattermost-redux/selectors/entities/preferences';
import {GlobalState} from '@mattermost/types/store';

import {MuiMenuStyled} from 'components/menu/menu_styled';
import {MenuItem} from 'components/menu/menu_item';

import {A11yClassNames, Preferences} from 'utils/constants';
import {getCurrentMomentForTimezone} from 'utils/timezone';

import './schedule_post_menu.scss';

type Props = {
    open: boolean;
    timezone?: string;
    getAnchorEl: () => HTMLDivElement | null;
    onClose: () => void;
    handleSchedulePostMenu: (optionName: SchedulePostMenuOption['name']) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
};

type IntlMessage = {
    id: string;
    defaultMessage: string;
};

export type SchedulePostMenuOption = {
    name: 'tomorrow' | 'monday' | 'custom';
    title?: IntlMessage;
};

const schedulePostItems: SchedulePostMenuOption[] = [
    {name: 'tomorrow'},
    {name: 'monday'},
    {name: 'custom', title: {id: 'create_post.schedule_post.menu.options.custom.title', defaultMessage: 'Custom Time'}},
];

const menuProps: Partial<MenuProps> = {
    className: `${A11yClassNames.POPUP} schedule-post`,
    TransitionComponent: Fade,
    TransitionProps: {timeout: {
        enter: 150,
        exit: 100,
    }},
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
    },
    transformOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
    },
};

const SchedulePostMenu = ({open, timezone, getAnchorEl, onClose, handleSchedulePostMenu, handleKeyDown}: Props) => {
    const isMilitaryTime = useSelector((state: GlobalState) => getBool(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.USE_MILITARY_TIME, false));

    const getMenuItemLabel = ({name, title}: SchedulePostMenuOption) => {
        if (name === 'custom') {
            return <FormattedMessage {...title}/>;
        }
        const timestamp = getCurrentMomentForTimezone(timezone).hours(9).minutes(0).seconds(0);
        if (name === 'monday') {
            timestamp.add(1, 'week').isoWeekday(1);
        }
        return (
            <FormattedMessage
                id='create_post.schedule_post.menu.options.date.title'
                defaultMessage='{date} at {time}'
                values={{
                    date: name === 'tomorrow' ? (
                        <FormattedMessage
                            id='create_post.schedule_post.menu.options.tomorrow'
                            defaultMessage='Tomorrow'
                        />
                    ) : (
                        <FormattedDate
                            value={timestamp.toDate()}
                            weekday='short'
                            timeZone={timezone}
                        />
                    ),
                    time: (
                        <FormattedTime
                            value={timestamp.toDate()}
                            hour12={!isMilitaryTime}
                            hour='2-digit'
                            minute='2-digit'
                        />
                    ),
                }}
            />
        );
    };
    const renderedScheduledPostItems = schedulePostItems.map((option) => (
        <MenuItem
            key={'schedule-post-menu-' + option.name}
            labels={getMenuItemLabel(option)}
            onClick={() => handleSchedulePostMenu(option.name)}
            tabIndex={0}
        />
    ));
    return (
        <MuiMenuStyled
            open={open}
            onClose={onClose}
            anchorEl={getAnchorEl()}
            onKeyDown={handleKeyDown}
            {...menuProps}
        >
            <h5
                className='schedule-post__menu-header'
                tabIndex={-1}
            >
                <FormattedMessage
                    id='create_post.schedule_post.menu.title'
                    defaultMessage='Schedule draft:'
                />
            </h5>
            {renderedScheduledPostItems}
        </MuiMenuStyled>
    );
};

export default SchedulePostMenu;
