'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
  Trash2,
} from 'lucide-react';
import Button from './button';
import type { HtmlEditorProps } from '@/types';

export default function HtmlEditor({
  value,
  onChange,
  placeholder = 'Start typing…',
  readOnly = false,
}: HtmlEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editable: !readOnly,
  });

  if (!editor) {
    return <div role="status" aria-live="polite" className="text-center py-4 text-gray-500">Loading editor...</div>;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {!readOnly && (
        <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            variant={editor.isActive('bold') ? 'primary' : 'outline'}
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center"
            title="Bold"
          >
            <Bold size={14} />
          </Button>

          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            variant={editor.isActive('italic') ? 'primary' : 'outline'}
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center"
            title="Italic"
          >
            <Italic size={14} />
          </Button>

          <span className="border-l border-gray-300 mx-1" />

          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            variant={editor.isActive('heading', { level: 1 }) ? 'primary' : 'outline'}
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center"
            title="Heading 1"
          >
            <Heading1 size={14} />
          </Button>

          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            variant={editor.isActive('heading', { level: 2 }) ? 'primary' : 'outline'}
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center"
            title="Heading 2"
          >
            <Heading2 size={14} />
          </Button>

          <span className="border-l border-gray-300 mx-1" />

          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editor.isActive('bulletList') ? 'primary' : 'outline'}
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center"
            title="Bullet List"
          >
            <List size={14} />
          </Button>

          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editor.isActive('orderedList') ? 'primary' : 'outline'}
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center"
            title="Ordered List"
          >
            <ListOrdered size={14} />
          </Button>

          <span className="border-l border-gray-300 mx-1" />

          <Button
            type="button"
            onClick={() => {
              const url = prompt('Enter the URL of the link:');
              if (url) {
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
              }
            }}
            variant={editor.isActive('link') ? 'primary' : 'outline'}
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center"
            title="Link"
          >
            <LinkIcon size={14} />
          </Button>

          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            variant={editor.isActive('codeBlock') ? 'primary' : 'outline'}
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center"
            title="Code Block"
          >
            <Code size={14} />
          </Button>

          <span className="border-l border-gray-300 mx-1" />

          <Button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center"
            title="Undo"
          >
            <Undo size={14} />
          </Button>

          <Button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center"
            title="Redo"
          >
            <Redo size={14} />
          </Button>

          <Button
            type="button"
            onClick={() => editor.chain().focus().clearContent().run()}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 flex items-center justify-center text-red-600 hover:text-red-700"
            title="Clear"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="p-4 min-h-[300px] bg-white text-gray-900"
      />
    </div>
  );
}
