// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import GenericModal from 'components/generic_modal';

type Props = {
    displayName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

function SendDraftModal({
    displayName,
    onCancel,
    onConfirm,
}: Props) {
    const {formatMessage} = useIntl();

    const title = formatMessage({
        id: 'drafts.confirm.send.title',
        defaultMessage: 'Send Message now',
    });

    const confirmButtonText = formatMessage({
        id: 'drafts.confirm.send.button',
        defaultMessage: 'Yes, Send Now',
    });

    const message = (
        <FormattedMessage
            id={'drafts.confirm.send.text'}
            defaultMessage={'Are you sure you want to send this message to <strong>{displayName}</strong>?'}
            values={{
                strong: (chunk: string) => <strong>{chunk}</strong>,
                displayName,
            }}
        />
    );

    return (
        <GenericModal
            confirmButtonText={confirmButtonText}
            handleCancel={() => {}}
            handleConfirm={onConfirm}
            modalHeaderText={title}
            onExited={onCancel}
        >
            <div>{message}</div>
        </GenericModal>
    );
}

export default SendDraftModal;
