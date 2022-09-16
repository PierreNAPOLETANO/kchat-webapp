// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';

import Pluggable from 'plugins/pluggable';

import GlobalSearchNav from './global_search_nav/global_search_nav';
import UserGuideDropdown from './user_guide_dropdown';

const CenterControlsContainer = styled.div`
    display: flex;
    align-items: center;
    height: 40px;
    justify-content: flex-start;
    flex-grow: 1;
    border-bottom: solid 1px rgba(var(--center-channel-color-rgb), 0.12);
    border-left: solid 1px rgba(var(--center-channel-color-rgb), 0.12);

    > * + * {
        margin-left: 3px;
    }
`;

export type Props = {
    productId?: string | null;
}

const CenterControls = ({productId = null}: Props): JSX.Element => {
    return (
        <CenterControlsContainer>
            {productId === null ? (
                <>
                    <GlobalSearchNav/>
                    <UserGuideDropdown/>
                </>
            ) : (
                <Pluggable
                    pluggableName={'Product'}
                    subComponentName={'headerCentreComponent'}
                    pluggableId={productId}
                />
            )}
        </CenterControlsContainer>
    );
};

export default CenterControls;
