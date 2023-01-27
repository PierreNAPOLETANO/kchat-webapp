// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

const ExternalLimitReachedIcon = () => {
    return (
        <svg
            width='146'
            height='111'
            viewBox='0 0 146 111'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
        >
            <path
                d='M95.1063 10.0723H129.083C132.351 10.0723 135 12.7215 135 15.9895V37.0687C135 40.3367 132.351 42.986 129.083 42.986H124.435L115.912 52.0656V42.986H95.1063C91.8383 42.986 89.1891 40.3367 89.1891 37.0687V15.9895C89.1891 12.7215 91.8383 10.0723 95.1063 10.0723Z'
                fill='#0088B2'
            />
            <path
                d='M79.9331 81.3455L79.7428 81.156H79.4743H36.9172C34.0082 81.156 31.65 78.7978 31.65 75.8888V33.8645C31.65 30.9555 34.0082 28.5973 36.9172 28.5973H105.252C108.161 28.5973 110.519 30.9555 110.519 33.8645V75.8888C110.519 78.7978 108.161 81.156 105.252 81.156H94.3895H93.7395V81.806V95.0987L79.9331 81.3455Z'
                fill='#FAFAFA'
                stroke='#E0E0E0'
                strokeWidth='1.3'
            />
            <rect
                x='40.3223'
                y='42.8105'
                width='59.6607'
                height='7.4288'
                rx='3.7144'
                fill='#D9D9D9'
            />
            <rect
                x='40.3223'
                y='57.6641'
                width='44.7455'
                height='7.4288'
                rx='3.7144'
                fill='#D9D9D9'
            />
            <path
                d='M83.0004 107.926C111.637 107.926 134.852 105.212 134.852 101.863C134.852 98.5151 111.637 95.8008 83.0004 95.8008C54.3633 95.8008 31.1484 98.5151 31.1484 101.863C31.1484 105.212 54.3633 107.926 83.0004 107.926Z'
                fill='white'
            />
            <circle
                cx='133'
                cy='91'
                r='13'
                fill='url(#pattern0)'
            />
            <circle
                cx='20'
                cy='20'
                r='20'
                fill='url(#pattern1)'
            />
            <defs>
                <pattern
                    id='pattern0'
                    patternContentUnits='objectBoundingBox'
                    width='1'
                    height='1'
                >
                    <use
                        xlinkHref='#image0_1494_34906'
                        transform='scale(0.0153846)'
                    />
                </pattern>
                <pattern
                    id='pattern1'
                    patternContentUnits='objectBoundingBox'
                    width='1'
                    height='1'
                >
                    <use
                        xlinkHref='#image1_1494_34906'
                        transform='scale(0.0153846)'
                    />
                </pattern>
                <image
                    id='image0_1494_34906'
                    width='65'
                    height='65'
                    xlinkHref='data:image/png;base64,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'
                />
                <image
                    id='image1_1494_34906'
                    width='65'
                    height='65'
                    xlinkHref='data:image/png;base64,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'
                />
            </defs>
        </svg>
    );
};

export default ExternalLimitReachedIcon;
