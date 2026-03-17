'use client';

import { toast } from 'sonner';
import { useCategories } from '@/hooks/useCategories';
import CategoryList from '@/components/categories/CategoryList';

export default function CategoriesPage() {
  const { categories, isLoading, deleteCategory } = useCategories();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteCategory(id);
      toast.success(`"${name}" deleted successfully`);
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <CategoryList
      categories={categories}
      isLoading={isLoading}
      onDelete={handleDelete}
    />
  );
}
