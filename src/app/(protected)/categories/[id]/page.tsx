'use client';

import { use } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/category';
import CategoryForm from '@/components/categories/CategoryForm';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { categories, updateCategory, deleteCategory, isLoading } = useCategories();

  const category = categories.find((c) => c.id === id);

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500 text-lg">Category not found.</p>
        <button
          className="mt-4 text-green-600 hover:underline text-sm"
          onClick={() => router.push('/categories')}
        >
          Back to Categories
        </button>
      </div>
    );
  }

  const handleSubmit = async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => {
    try {
      await updateCategory(id, data);
      toast.success(`"${data.name}" updated successfully`);
      router.push('/categories');
    } catch {
      toast.error('Failed to update category');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;
    try {
      await deleteCategory(id);
      toast.success(`"${category.name}" deleted successfully`);
      router.push('/categories');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-gray-500 mt-1">Update the details for &ldquo;{category.name}&rdquo;</p>
        </div>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
      <CategoryForm category={category} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
