import React from 'react';
import { useSlate } from 'slate-react';
import { Editor, Transforms, Element as SlateElement } from 'slate';
import './SlateToolbarStyles.scss';

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === format,
    });
    return !!match;
};

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    const isList = format === 'list-item';

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            ['bulleted-list', 'numbered-list'].includes(n.type),
        split: true,
    });

    let newProperties;
    if (format === 'heading-one' || format === 'heading-two') {
        newProperties = {
            type: isActive ? 'paragraph' : format,
        };
    } else {
        newProperties = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        };
    }
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
        const block = { type: 'bulleted-list', children: [] };
        Transforms.wrapNodes(editor, block);
    }
};


const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const ToolbarButton = ({ active, onMouseDown, children }) => (
    <button
        className={`slate-toolbar__button ${active ? 'slate-toolbar__button--active' : ''}`}
        onMouseDown={onMouseDown}
        type="button"
    >
        {children}
    </button>
);

const BlockButton = ({ format, children }) => {
    const editor = useSlate();
    return (
        <ToolbarButton
            active={isBlockActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
        >
            {children}
        </ToolbarButton>
    );
};

const MarkButton = ({ format, children }) => {
    const editor = useSlate();
    return (
        <ToolbarButton
            active={isMarkActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
        >
            {children}
        </ToolbarButton>
    );
};

export const SlateToolbar = () => {
    return (
        <div className="slate-toolbar">
            <MarkButton format="bold">
                <strong>B</strong>
            </MarkButton>
            <MarkButton format="italic">
                <em>I</em>
            </MarkButton>
            <MarkButton format="underline">
                <u>U</u>
            </MarkButton>

            <BlockButton format="heading-one">
                Заголовок 1
            </BlockButton>
            <BlockButton format="heading-two">
                Заголовок 2
            </BlockButton>

            <BlockButton format="list-item">
                Список
            </BlockButton>
        </div>
    );
};