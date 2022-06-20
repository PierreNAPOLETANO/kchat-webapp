// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
self.token = null;
self.addEventListener('message', (event) => {
    if (event.data.token && event.data.token !== '') {
        self.token = event.data.token;
    }
});

self.addEventListener('install', () => {
    console.log('Service worker has been installed');
});

self.addEventListener('activate', () => {
    console.log('Claiming control');
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const authHeader = event.request.headers.get('Authorization');
    if (authHeader !== null) {
        const authHeaderSplited = authHeader.split(' ');

        if (authHeaderSplited[0] === 'Bearer' && authHeaderSplited[1] && authHeaderSplited[1] !== '') {
            return;
        }
        if (self.token && self.token !== null) {
            const newRequest = new Request(event.request, {
                headers: {Authorization: `Bearer ${self.token}`},
            });
            return fetch(newRequest);
        }
    } else if (self.token && self.token !== null) {
        const newRequest = new Request(event.request, {
            headers: {Authorization: `Bearer ${self.token}`},
        });
        return fetch(newRequest);
    }
});
