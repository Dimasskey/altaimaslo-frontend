import { useState, useCallback, useMemo } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';

const EMPTY_VALUE = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

const htmlToSlate = (htmlContent) => {
    if (!htmlContent || htmlContent.trim() === '') {
        return EMPTY_VALUE;
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const body = doc.body;

        const result = [];

        for (const child of body.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = child.tagName.toLowerCase();

                if (tagName === 'p' || tagName === 'h1' || tagName === 'h2') {
                    let type = 'paragraph';
                    if (tagName === 'h1') type = 'heading-one';
                    if (tagName === 'h2') type = 'heading-two';

                    const children = processInlineNodes(child);

                    result.push({
                        type: type,
                        children: children,
                    });
                } else if (tagName === 'ul' || tagName === 'ol') {
                    const listItems = Array.from(child.children || []);
                    if (listItems.length > 0) {
                        const listType = tagName === 'ul' ? 'bulleted-list' : 'numbered-list';
                        const listChildren = listItems.map(li => ({
                            type: 'list-item',
                            children: processInlineNodes(li),
                        }));

                        if (listChildren.length > 0) {
                            result.push({
                                type: listType,
                                children: listChildren,
                            });
                        }
                    }
                } else if (tagName === 'li') {
                    const children = processInlineNodes(child);
                    if (children.length > 0) {
                        result.push({
                            type: 'list-item',
                            children: children,
                        });
                    }
                }
            }
        }

        return result.length > 0 ? result : EMPTY_VALUE;

    } catch (error) {
        console.error(error);
        return EMPTY_VALUE;
    }
};

const processInlineNodes = (node) => {
    const children = [];

    for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent || '';
            if (text.trim() !== '') {
                children.push({ text: text });
            }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            const tagName = child.tagName.toLowerCase();

            if (tagName === 'strong' || tagName === 'b') {
                const grandChildren = processInlineNodes(child);
                grandChildren.forEach(gc => {
                    children.push({ ...gc, bold: true });
                });
            } else if (tagName === 'em' || tagName === 'i') {
                const grandChildren = processInlineNodes(child);
                grandChildren.forEach(gc => {
                    children.push({ ...gc, italic: true });
                });
            } else if (tagName === 'u') {
                const grandChildren = processInlineNodes(child);
                grandChildren.forEach(gc => {
                    children.push({ ...gc, underline: true });
                });
            } else if (tagName === 'br') {
                children.push({ text: '\n' });
            } else {
                const grandChildren = processInlineNodes(child);
                children.push(...grandChildren);
            }
        }
    }

    return children;
};

const slateToHtml = (slateValue) => {
    if (!slateValue || !Array.isArray(slateValue)) return '';

    try {
        let html = '';

        slateValue.forEach(node => {
            if (node.children && Array.isArray(node.children)) {
                let processedContent = '';

                switch (node.type) {
                    case 'heading-one': {
                        processedContent = processSlateChildren(node.children);
                        if (processedContent.trim()) {
                            html += `<h1>${processedContent}</h1>`;
                        }
                        break;
                    }
                    case 'heading-two': {
                        processedContent = processSlateChildren(node.children);
                        if (processedContent.trim()) {
                            html += `<h2>${processedContent}</h2>`;
                        }
                        break;
                    }
                    case 'bulleted-list': {
                        const listItems = processListItems(node.children);
                        if (listItems) {
                            html += `<ul>${listItems}</ul>`;
                        }
                        break;
                    }
                    case 'numbered-list': {
                        const listItems = processListItems(node.children);
                        if (listItems) {
                            html += `<ol>${listItems}</ol>`;
                        }
                        break;
                    }
                    case 'list-item': {
                        processedContent = processSlateChildren(node.children);
                        if (processedContent.trim()) {
                            html += `<li>${processedContent}</li>`;
                        }
                        break;
                    }
                    default: {
                        processedContent = processSlateChildren(node.children);
                        if (processedContent.trim()) {
                            html += `<p>${processedContent}</p>`;
                        }
                    }
                }
            }
        });

        return html || '';
    } catch (error) {
        console.error(error);
        return '';
    }
};

const processListItems = (children) => {
    const items = children
        .map(listItem => {
            if (listItem.type === 'list-item' && listItem.children) {
                const itemContent = processSlateChildren(listItem.children);
                return itemContent.trim() ? `<li>${itemContent}</li>` : '';
            }
            return '';
        })
        .filter(item => item !== '');

    return items.length > 0 ? items.join('') : null;
};

const processSlateChildren = (children) => {
    return children.map(child => {
        if (child.text !== undefined) {
            let text = child.text || '';

            if (child.bold) text = `<strong>${text}</strong>`;
            if (child.italic) text = `<em>${text}</em>`;
            if (child.underline) text = `<u>${text}</u>`;

            text = text.replace(/\n/g, '<br>');

            return text;
        }
        return '';
    }).join('');
};

export const useSlateEditor = () => {
    const editor = useMemo(() => withReact(createEditor()), []);
    const [value, setValue] = useState(EMPTY_VALUE);
    const [key, setKey] = useState(0);

    const initializeEditor = useCallback((htmlContent) => {

        const slateValue = htmlToSlate(htmlContent);

        if (editor) {
            editor.children = slateValue;
            editor.selection = null;
            editor.marks = null;
        }

        setValue(slateValue);
        setKey(prev => prev + 1);
    }, [editor]);

    const getHtmlContent = useCallback(() => {
        const html = slateToHtml(value);
        return html;
    }, [value]);

    const clearEditor = useCallback(() => {
        if (editor) {
            editor.children = EMPTY_VALUE;
            editor.selection = null;
            editor.marks = null;
        }
        setValue(EMPTY_VALUE);
        setKey(prev => prev + 1);
    }, [editor]);

    return {
        editor,
        value,
        setValue,
        initializeEditor,
        getHtmlContent,
        clearEditor,
        editorKey: key
    };
};