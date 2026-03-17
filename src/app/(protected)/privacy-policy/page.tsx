'use client';

import { useEffect, useState } from 'react';
import { Save, Eye, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/button';
import HtmlEditor from '@/components/ui/HtmlEditor';

const STORAGE_KEY = 'privacy-policy-content';
const DEFAULT_CONTENT = '<h1>Privacy Policy</h1><p>Enter your privacy policy content here...</p>';

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setContent(saved);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    localStorage.setItem(STORAGE_KEY, content);
    setIsSaving(false);
    setIsEditing(false);
    toast.success('Privacy policy updated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-500 mt-1">Manage your privacy policy content</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Content
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {isEditing ? (
          <HtmlEditor
            value={content}
            onChange={setContent}
            placeholder="Enter privacy policy content..."
          />
        ) : (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
}
