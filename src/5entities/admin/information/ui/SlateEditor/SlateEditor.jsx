import React, { useCallback, useEffect } from 'react';
import { Slate, Editable } from 'slate-react';
import { SlateToolbar } from '../SlateToolbar/SlateToolbar';
import '@/6shared/styles/InformationContentStyles.scss';

const EMPTY_VALUE = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>;
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>;
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>;
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>;
        case 'list-item':
            return <li {...attributes}>{children}</li>;
        default:
            return <p {...attributes}>{children}</p>;
    }
};

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
        children = <em>{children}</em>;
    }
    if (leaf.underline) {
        children = <u>{children}</u>;
    }
    return <span {...attributes}>{children}</span>;
};

export const SlateEditor = ({
                                editor,
                                value,
                                onChange,
                                editorKey,
                                placeholder = "Введите текст..."
                            }) => {
    const renderElement = useCallback(props => <Element {...props} />, []);
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);

    const safeValue = Array.isArray(value) && value.length > 0 ? value : EMPTY_VALUE;

    useEffect(() => {
        if (editor) {
            editor.selection = null;
            editor.marks = null;
        }
    }, [editorKey, editor]);

    return (
        <div className="information-content">
            <Slate
                key={editorKey}
                editor={editor}
                initialValue={safeValue}
                onChange={onChange}
            >
                <SlateToolbar />
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder={placeholder}
                    className="information-content-wrapper"
                />
            </Slate>
        </div>
    );
};