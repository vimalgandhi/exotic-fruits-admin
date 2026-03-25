'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import type { Product } from '@/types';
import ProductForm from '@/components/products/ProductForm';
import { AlertCircle } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const { createProduct, isLoading } = useProducts();
  const { categories, error: categoriesError } = useCategories();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createProduct(formData);
      toast.success('Product created successfully');
      router.push('/products');
    } catch (error) {
      // Re-throw so form component can catch and display
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to create a new product</p>
      </div>

      {/* Show error if categories failed to load, but still allow form to render */}
      {categoriesError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-900">Note</h3>
            <p className="text-sm text-yellow-700">Could not load categories. Please refresh the page if you need to select a category.</p>
          </div>
        </div>
      )}

      <ProductForm 
        categories={categories || []} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}
