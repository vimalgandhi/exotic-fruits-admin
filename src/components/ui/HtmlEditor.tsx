'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import type { HtmlEditorProps } from '@/types';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const TOOLBAR_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['clean'],
  ],
};

const FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'blockquote',
  'code-block',
  'link',
  'image',
  'color',
  'background',
  'align',
];

export default function HtmlEditor({
  value,
  onChange,
  placeholder = 'Start typing…',
  readOnly = false,
  theme = 'snow',
}: HtmlEditorProps) {
  return (
    <div className="html-editor">
      <ReactQuill
        theme={theme}
        value={value}
        onChange={onChange}
        modules={readOnly ? { toolbar: false } : TOOLBAR_MODULES}
        formats={FORMATS}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      <style jsx global>{`
        .html-editor .ql-container {
          font-size: 14px;
          min-height: 300px;
        }
        .html-editor .ql-editor {
          min-height: 300px;
        }
        .html-editor .ql-toolbar {
          border-radius: 8px 8px 0 0;
          border-color: #d1d5db;
          background-color: #f9fafb;
        }
        .html-editor .ql-container {
          border-radius: 0 0 8px 8px;
          border-color: #d1d5db;
        }
        .html-editor .ql-editor:focus {
          outline: none;
        }
        .html-editor .ql-container:focus-within {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
        }
      `}</style>
    </div>
  );
}
