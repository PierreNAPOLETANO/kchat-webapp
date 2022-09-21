// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import styled from 'styled-components';
import Icon from '@infomaniak/compass-components/foundations/icon/Icon';

import {CompletedAnimation} from './onboarding_tasklist_animations';

export interface TaskProps {
    label: React.ReactElement | string;
    icon?: React.ReactNode;
    onClick?: () => void;
    completedStatus: boolean;
}

const StyledTask = styled.div`
    display: flex;
    background-color: var(--center-channel-bg);
    cursor: pointer;
    width: 100%;
    padding: 8px 20px;
    font-size: 14px;
    align-items: flex-start;
    color: var(--center-channel-color);
    position: relative;

    &.completed {
        color: var(--denim-status-online);

        span {
            text-decoration: line-through;
        }
    }

    i.play {
        margin: 3px 10px 0 0;
        color: rgba(var(--center-channel-color-rgb), 0.56);
        &.completed {
            color: var(--denim-status-online);
        }
    }
    :hover {
        background: rgba(var(--center-channel-color-rgb), 0.08);
    }
    :active {
        background-color: rgba(var(--button-bg-rgb), 0.08);
    }
    :focus {
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.32),
            inset 0 0 0 2px blue;
    }
    transition: background 250ms ease-in-out, color 250ms ease-in-out,
        box-shadow 250ms ease-in-out;
`;

export const Task = (props: TaskProps): JSX.Element => {
    const {label, completedStatus, onClick} = props;

    const handleOnClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <StyledTask
            className={completedStatus ? 'completed' : ''}
            onClick={handleOnClick}
        >
            {completedStatus && <CompletedAnimation completed={completedStatus}/>}
            <Icon
                className={completedStatus ? 'play completed' : 'play'}
                glyph={completedStatus ? 'check' : 'play'}
                size={16}
            />
            <span>{label}</span>
        </StyledTask>
    );
};
