'use client';

import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useState, useEffect } from 'react';
import type { HtmlEditorProps } from '@/types';

export default function HtmlEditorContent({
  value,
  onChange,
  placeholder = 'Enter content...',
  readOnly = false,
}: HtmlEditorProps) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (value) {
      try {
        const contentState = convertFromRaw(JSON.parse(value));
        setEditorState(EditorState.createWithContent(contentState));
      } catch {
        // If value is not valid JSON, create empty state
        setEditorState(EditorState.createEmpty());
      }
    }
  }, []);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    onChange(JSON.stringify(rawContentState));
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class dark:bg-gray-900 dark:text-gray-100 p-4 min-h-[300px]"
        toolbarClassName="toolbar-class bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"
        readOnly={readOnly}
        placeholder={placeholder}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'link', 'history'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
          },
          blockType: {
            options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote', 'Code'],
          },
          list: {
            options: ['unordered', 'ordered'],
          },
          link: {
            options: ['link'],
          },
        }}
      />
    </div>
  );
}
