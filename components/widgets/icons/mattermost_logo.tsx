// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, { CSSProperties } from 'react';
import { useIntl } from 'react-intl';

export default function MattermostLogo(props: React.HTMLAttributes<HTMLSpanElement>) {
    const {formatMessage} = useIntl();
    return (
        <span {...props}>
            {/* <svg
                version='1.1'
                x='0px'
                y='0px'
                viewBox='0 0 500 500'
                enableBackground='new 0 0 500 500'
                role='img'
                aria-label={formatMessage({id: 'generic_icons.mattermost', defaultMessage: 'Mattermost Logo'})}
            >
                <g>
                    <g>
                        <path
                            style={style}
                            d='M396.9,47.7l2.6,53.1c43,47.5,60,114.8,38.6,178.1c-32,94.4-137.4,144.1-235.4,110.9 S51.1,253.1,83,158.7C104.5,95.2,159.2,52,222.5,40.5l34.2-40.4C150-2.8,49.3,63.4,13.3,169.9C-31,300.6,39.1,442.5,169.9,486.7 s272.6-25.8,316.9-156.6C522.7,223.9,483.1,110.3,396.9,47.7z'
                        />
                    </g>
                    <path
                        style={style}
                        d='M335.6,204.3l-1.8-74.2l-1.5-42.7l-1-37c0,0,0.2-17.8-0.4-22c-0.1-0.9-0.4-1.6-0.7-2.2 c0-0.1-0.1-0.2-0.1-0.3c0-0.1-0.1-0.2-0.1-0.2c-0.7-1.2-1.8-2.1-3.1-2.6c-1.4-0.5-2.9-0.4-4.2,0.2c0,0-0.1,0-0.1,0 c-0.2,0.1-0.3,0.1-0.4,0.2c-0.6,0.3-1.2,0.7-1.8,1.3c-3,3-13.7,17.2-13.7,17.2l-23.2,28.8l-27.1,33l-46.5,57.8 c0,0-21.3,26.6-16.6,59.4s29.1,48.7,48,55.1c18.9,6.4,48,8.5,71.6-14.7C336.4,238.4,335.6,204.3,335.6,204.3z'
                    />
                </g>
            </svg> */}
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label={formatMessage({id: 'generic_icons.kChat', defaultMessage: 'kChat Logo'})}>
                <g clipPath="url(#clip0_6033_73367)">
                <g clipPath="url(#clip1_6033_73367)">
                <path opacity="0.289597" style={style} d="M36.2576 0.781054L87.8867 16.4718C89.8561 17.0703 91.1999 18.8675 91.1999 20.9027V64.5148C91.1999 67.0751 89.0986 69.1507 86.5064 69.1507C86.0385 69.1507 85.5733 69.0816 85.1261 68.9457L33.497 53.255C31.5276 52.6564 30.1837 50.8592 30.1837 48.8241V5.21195C30.1837 2.65161 32.2851 0.57605 34.8773 0.57605C35.3452 0.57605 35.8104 0.645149 36.2576 0.781054Z" fill="#0088B2"/>
                <path opacity="0.289597" style={style} d="M36.0259 0.781054L87.655 16.4718C89.6243 17.0703 90.9682 18.8675 90.9682 20.9027V64.5148C90.9682 67.0751 88.8668 69.1507 86.2747 69.1507C85.8068 69.1507 85.3415 69.0816 84.8943 68.9457L33.2653 53.255C31.2959 52.6564 29.952 50.8592 29.952 48.8241V5.21195C29.952 2.65161 32.0534 0.57605 34.6456 0.57605C35.1134 0.57605 35.5787 0.645149 36.0259 0.781054Z" fill="#0088B2"/>
                <path opacity="0.6" style={style} d="M24.5344 8.20049L76.1635 23.8912C78.1329 24.4898 79.4767 26.287 79.4767 28.3221V71.9342C79.4767 74.4946 77.3754 76.5702 74.7832 76.5702C74.3153 76.5702 73.8501 76.5011 73.4029 76.3652L21.7738 60.6744C19.8044 60.0759 18.4605 58.2787 18.4605 56.2435V12.6314C18.4605 10.071 20.5619 7.99548 23.1541 7.99548C23.622 7.99548 24.0872 8.06458 24.5344 8.20049Z" fill="#0088B2"/>
                <path style={style} d="M12.7939 17.4714L64.423 33.1621C66.3923 33.7606 67.7362 35.5578 67.7362 37.593V81.2215C67.7362 83.7819 65.6348 85.8574 63.0426 85.8574C62.5787 85.8574 62.1173 85.7895 61.6736 85.6558L47.7886 81.4735V93.2984C47.7886 94.5786 46.7379 95.6164 45.4418 95.6164C44.6886 95.6164 43.9811 95.2592 43.5398 94.6563L30.6381 77.0252C30.3455 76.6254 29.9314 76.3282 29.4561 76.1768L9.97364 69.9742C8.03446 69.3568 6.72 67.5742 6.72 65.5618V21.9023C6.72 19.3419 8.82138 17.2664 11.4136 17.2664C11.8814 17.2664 12.3467 17.3355 12.7939 17.4714Z" fill="#0088B2"/>
                <path d="M20.1958 42.5759C18.3879 39.022 21.7151 35.0211 25.5493 36.1385L39.9129 40.3242C41.4578 40.7744 42.6623 41.9835 43.1046 43.5282C44.1326 47.1181 40.746 50.4179 37.1759 49.3049L22.8937 44.8524C21.7233 44.4875 20.7508 43.6669 20.1958 42.5759Z" fill="white"/>
                <path d="M49.1437 66.248C51.8206 64.2311 51.1268 60.0508 47.9433 59.0161L33.694 54.385C32.4044 53.9658 30.9891 54.203 29.9047 55.0201C27.2277 57.037 27.9216 61.2173 31.105 62.252L45.3543 66.8831C46.6439 67.3023 48.0592 67.0651 49.1437 66.248Z" fill="white"/>
                </g>
                </g>
                <defs>
                <clipPath id="clip0_6033_73367">
                <rect width="96" height="96" fill="white"/>
                </clipPath>
                <clipPath id="clip1_6033_73367">
                <rect width="96" height="96" fill="white"/>
                </clipPath>
                </defs>
            </svg>
        </span>
    );
}

const style: CSSProperties = {
    fillRule: 'evenodd',
    clipRule: 'evenodd',
};
