// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ComponentProps} from 'react';
import {shallow} from 'enzyme';

import AdvancedSettingsDisplay from 'components/user_settings/advanced/user_settings_advanced';

import {Preferences} from 'utils/constants';
import {TestHelper} from 'utils/test_helper';
import {isMac} from 'utils/utils';

jest.mock('actions/global_actions');
jest.mock('utils/utils');

describe('components/user_settings/display/UserSettingsDisplay', () => {
    const user = TestHelper.getUserMock({
        id: 'user_id',
        username: 'username',
        locale: 'en',
        timezone: {
            useAutomaticTimezone: 'true',
            automaticTimezone: 'America/New_York',
            manualTimezone: '',
        },
    });

    const requiredProps: ComponentProps<typeof AdvancedSettingsDisplay> = {
        currentUser: user,
        updateSection: jest.fn(),
        activeSection: '',
        closeModal: jest.fn(),
        collapseModal: jest.fn(),
        actions: {
            savePreferences: jest.fn(),
            updateUserActive: jest.fn().mockResolvedValue({data: true}),
            revokeAllSessionsForUser: jest.fn().mockResolvedValue({data: true}),
        },
        advancedSettingsCategory: [],
        sendOnCtrlEnter: '',
        formatting: '',
        joinLeave: '',
        syncDrafts: '',
        unreadScrollPosition: Preferences.UNREAD_SCROLL_POSITION_START_FROM_LEFT,
        codeBlockOnCtrlEnter: 'false',
        enablePreviewFeatures: false,
        enableUserDeactivation: false,
        syncedDraftsAreAllowed: true,
    };

    test('should have called handleSubmit', async () => {
        const updateSection = jest.fn();

        const props = {...requiredProps, updateSection};
        const wrapper = shallow<AdvancedSettingsDisplay>(<AdvancedSettingsDisplay {...props}/>);

        await wrapper.instance().handleSubmit([]);
        expect(updateSection).toHaveBeenCalledWith('');
    });

    test('should have called updateSection', () => {
        const updateSection = jest.fn();
        const props = {...requiredProps, updateSection};
        const wrapper = shallow<AdvancedSettingsDisplay>(<AdvancedSettingsDisplay {...props}/>);

        wrapper.instance().handleUpdateSection('');
        expect(updateSection).toHaveBeenCalledWith('');

        wrapper.instance().handleUpdateSection('linkpreview');
        expect(updateSection).toHaveBeenCalledWith('linkpreview');
    });

    test('function getCtrlSendText should return correct value for Mac', () => {
        (isMac as jest.Mock).mockReturnValue(true);
        const props = {...requiredProps};

        const wrapper = shallow<AdvancedSettingsDisplay>(<AdvancedSettingsDisplay {...props}/>);
        expect(wrapper.instance().getCtrlSendText().ctrlSendTitle.defaultMessage).toEqual('Send Messages on ⌘+ENTER');
    });

    test('function getCtrlSendText should return correct value for Windows', () => {
        (isMac as jest.Mock).mockReturnValue(false);
        const props = {...requiredProps};

        const wrapper = shallow<AdvancedSettingsDisplay>(<AdvancedSettingsDisplay {...props}/>);
        expect(wrapper.instance().getCtrlSendText().ctrlSendTitle.defaultMessage).toEqual('Send Messages on CTRL+ENTER');
    });
});
