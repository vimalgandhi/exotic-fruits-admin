'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import type { Product } from '@/types';
import ProductForm from '@/components/products/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const { createProduct, isLoading } = useProducts();
  const { categories } = useCategories();

  const handleSubmit = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createProduct(data);
      toast.success('Product created successfully');
      router.push('/products');
    } catch {
      toast.error('Failed to create product');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to create a new product</p>
      </div>
      <ProductForm categories={categories} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
