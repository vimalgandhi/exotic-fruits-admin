'use client';

import { use } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import type { Product } from '@/types';
import ProductForm from '@/components/products/ProductForm';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { products, updateProduct, isLoading } = useProducts();
  const { categories } = useCategories();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-gray-500 text-lg">Product not found.</p>
        <button
          className="mt-4 text-green-600 hover:underline text-sm"
          onClick={() => router.push('/products')}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleSubmit = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await updateProduct(id, data);
      toast.success('Product updated successfully');
      router.push('/products');
    } catch {
      toast.error('Failed to update product');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-1">Update the details for &ldquo;{product.name}&rdquo;</p>
      </div>
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
