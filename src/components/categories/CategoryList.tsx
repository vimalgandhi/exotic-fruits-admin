'use client';

import { useState } from 'react';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Category } from '@/types/category';
import Button from '@/components/ui/button';
import Table from '@/components/ui/table';

interface CategoryListProps {
  categories: Category[];
  isLoading?: boolean;
  onDelete: (id: string, name: string) => void;
}

export default function CategoryList({ categories, isLoading, onDelete }: CategoryListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: Category) => (
        <div className="flex items-center gap-2">
          <button
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            onClick={() => router.push(`/categories/${row.id}`)}
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            onClick={() => onDelete(row.id, row.name)}
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
        <Button onClick={() => router.push('/categories/new')}>
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
    </div>
  );
}
