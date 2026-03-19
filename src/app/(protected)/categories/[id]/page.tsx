'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getCategoryById, updateCategoryById, deleteAdminCategory } from '@/lib/api';
import type { Category } from '@/types/category';
import CategoryForm from '@/components/categories/CategoryForm';
import { useParams } from 'next/navigation';

export default function EditCategoryPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCategory() {
      setIsLoading(true);
      try {
        const data : any = await getCategoryById(id);
        setCategory(data.data as Category);
      } catch {
        toast.error('Failed to fetch category');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategory();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500 text-lg">Loading category...</p>
      </div>
    );
  }

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

  const handleSubmit = async (formData: FormData) => {
    try {
      await updateCategoryById(id, formData);
      toast.success('Category updated successfully');
      router.push('/categories');
    } catch (error) {
      // Re-throw so form component can catch and display
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;
    setIsLoading(true);
    try {
      await deleteAdminCategory(id);
      toast.success(`"${category.name}" deleted successfully`);
      router.push('/categories');
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Category for {category.name}</h1>
          {/* <p className="text-gray-500 mt-1">Update the details for &ldquo;{category.name}&rdquo;</p> */}
        </div>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
      <CategoryForm category={category} onSubmit={handleSubmit} isLoading={isLoading} isFetching={isLoading} />
    </div>
  );
}
