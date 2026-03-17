'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/category';
import CategoryForm from '@/components/categories/CategoryForm';

export default function NewCategoryPage() {
  const router = useRouter();
  const { createCategory, isLoading } = useCategories();

  const handleSubmit = async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => {
    try {
      await createCategory(data);
      toast.success(`"${data.name}" created successfully`);
      router.push('/categories');
    } catch {
      toast.error('Failed to create category');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to create a new category</p>
      </div>
      <CategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
