'use client';

import { useState } from 'react';
import { Pencil, Save } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_SEO_DATA } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import type { SeoData } from '@/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';

export default function SeoPage() {
  const [seoData, setSeoData] = useState<SeoData[]>(MOCK_SEO_DATA);
  const [editingItem, setEditingItem] = useState<SeoData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (item: SeoData) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingItem) return;
    setSeoData((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? { ...editingItem, updatedAt: new Date().toISOString() }
          : item
      )
    );
    setIsModalOpen(false);
    toast.success('SEO data updated successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SEO Management</h1>
        <p className="text-gray-500 mt-1">Manage meta tags and SEO settings for your pages</p>
      </div>

      <div className="space-y-4">
        {seoData.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{item.page}</h2>
                <p className="text-xs text-gray-400">Last updated: {formatDate(item.updatedAt)}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</span>
                <p className="text-sm text-gray-800 mt-0.5">{item.title}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</span>
                <p className="text-sm text-gray-800 mt-0.5">{item.description}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Keywords</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.keywords.split(',').map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit SEO Data" size="lg">
        {editingItem && (
          <div className="space-y-4">
            <Input
              label="Page Title"
              value={editingItem.title}
              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              />
            </div>
            <Input
              label="Keywords (comma-separated)"
              value={editingItem.keywords}
              onChange={(e) => setEditingItem({ ...editingItem, keywords: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
