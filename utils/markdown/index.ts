// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import marked from 'marked';

import {getConfig} from 'mattermost-redux/selectors/entities/general';

import store from 'stores/redux_store.jsx';

import {convertEntityToCharacter, fixedEncodeURIComponent} from 'utils/text_formatting';

import RemoveMarkdown from 'utils/markdown/remove_markdown';

import EmojiMap from 'utils/emoji_map';

import Renderer from './renderer';

const removeMarkdown = new RemoveMarkdown();

export function format(text: string, options = {}, emojiMap?: EmojiMap) {
    return formatWithRenderer(text, new Renderer({}, options, emojiMap));
}

export function formatWithRenderer(text: string, renderer: marked.Renderer) {
    const config = getConfig(store.getState());
    let outText = text;

    const markdownOptions = {
        renderer,
        sanitize: true,
        gfm: true,
        tables: true,
        mangle: false,
        inlinelatex: config.EnableLatex === 'true' && config.EnableInlineLatex === 'true',
    };

    if (text.startsWith('http') && text.includes('?')) {
        const splitLink = text.split('?');
        const location = splitLink.shift();
        const query = fixedEncodeURIComponent(splitLink.join('?'));
        outText = [location, query].join('?');
    }

    return marked(outText, markdownOptions).trim();
}

export function stripMarkdown(text: string) {
    if (typeof text === 'string' && text.length > 0) {
        return convertEntityToCharacter(
            formatWithRenderer(text, removeMarkdown),
        ).trim();
    }

    return text;
}
