// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {CSSProperties} from 'react';

type Props = {
    className?: string;
    fill?: string;
    style?: CSSProperties;
}

export default function LeaveCallIcon(props: Props) {
    return (
        <svg
            {...props}
            width='18px'
            height='8px'
            viewBox='0 0 18 8'
            role='img'
        >
            <path d='M9 2.30005C7.80469 2.30005 6.65625 2.47583 5.55469 2.82739V5.14771C5.55469 5.47583 5.41406 5.71021 5.13281 5.85083C4.42969 6.20239 3.76172 6.65942 3.12891 7.22192C2.98828 7.36255 2.8125 7.43286 2.60156 7.43286C2.39062 7.43286 2.21484 7.36255 2.07422 7.22192L0.210938 5.35864C0.0703125 5.21802 0 5.04224 0 4.8313C0 4.62036 0.0703125 4.44458 0.210938 4.30396C1.38281 3.20239 2.70703 2.34692 4.18359 1.73755C5.73047 1.10474 7.33594 0.78833 9 0.78833C10.6641 0.78833 12.2695 1.10474 13.8164 1.73755C15.293 2.34692 16.6172 3.20239 17.7891 4.30396C17.9297 4.44458 18 4.62036 18 4.8313C18 5.04224 17.9297 5.21802 17.7891 5.35864L15.9258 7.22192C15.7852 7.36255 15.6094 7.43286 15.3984 7.43286C15.1875 7.43286 15.0117 7.36255 14.8711 7.22192C14.2617 6.65942 13.5938 6.20239 12.8672 5.85083C12.5859 5.71021 12.4453 5.47583 12.4453 5.14771V2.82739C11.3438 2.47583 10.1953 2.30005 9 2.30005Z'/>
        </svg>
    );
}

