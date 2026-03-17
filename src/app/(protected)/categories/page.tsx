'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/useCategories';
import { formatDate } from '@/lib/utils';
import type { Category } from '@/types';
import Button from '@/components/ui/button';
import Table from '@/components/ui/table';
import CategoryModal from '@/components/modals/category-modal';

export default function CategoriesPage() {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteCategory(id);
      toast.success(`"${name}" deleted successfully`);
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleModalSubmit = async (
    data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>
  ) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast.success(`"${data.name}" updated successfully`);
      } else {
        await createCategory(data);
        toast.success(`"${data.name}" created successfully`);
      }
    } catch {
      toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Category',
      render: (_: unknown, row: Category) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (val: unknown) => (
        <span className="text-gray-600 text-sm">{String(val ?? '—')}</span>
      ),
    },
    { key: 'productCount', header: 'Products' },
    {
      key: 'status',
      header: 'Status',
      render: (val: unknown) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            val === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {String(val)}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (val: unknown) => formatDate(val as string),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: Category) => (
        <div className="flex items-center gap-2">
          <button
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            onClick={() => handleEdit(row)}
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            onClick={() => handleDelete(row.id, row.name)}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">{categories.length} categories total</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <Table<Category>
          data={filtered}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No categories found"
        />
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSubmit={handleModalSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
