'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_CONTENT_PAGES } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/button';

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState(MOCK_CONTENT_PAGES['privacy-policy'].content);
  const [isSaving, setIsSaving] = useState(false);
  const page = MOCK_CONTENT_PAGES['privacy-policy'];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    toast.success('Privacy policy updated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-500 mt-1">Last updated: {formatDate(page.updatedAt)}</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={20}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter privacy policy content (Markdown supported)..."
        />
        <p className="text-xs text-gray-400 mt-2">Markdown formatting is supported</p>
      </div>
    </div>
  );
}
