'use client';

import dynamic from 'next/dynamic';
import type { HtmlEditorProps } from '@/types';

const HtmlEditorContent = dynamic(() => import('./HtmlEditorContent'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-live="polite"
      className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 min-h-[300px] text-center text-gray-500"
    >
      Loading editor...
    </div>
  ),
});

export default function HtmlEditor(props: HtmlEditorProps) {
  return <HtmlEditorContent {...props} />;
}
