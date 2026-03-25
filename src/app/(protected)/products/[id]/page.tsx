'use client';

import { use, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import apiClient from '@/lib/api';
import type { Product } from '@/types';
import ProductForm from '@/components/products/ProductForm';
import { AlertCircle } from 'lucide-react';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { updateProduct, isLoading } = useProducts();
  const { categories, error: categoriesError } = useCategories();
  const [product, setProduct] = useState<Product | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const response = await apiClient.get<{ data: any }>(`/products/${id}`);
        const apiProduct = response.data.data;
        const transformedProduct: Product = {
          ...apiProduct,
          categoryId: String(apiProduct.category_id || apiProduct.categoryId || ''),
          pricelist: typeof apiProduct.pricelist === 'string' 
            ? JSON.parse(apiProduct.pricelist) 
            : (Array.isArray(apiProduct.pricelist) ? apiProduct.pricelist : []),
          images: apiProduct.image 
            ? [apiProduct.image]
            : (Array.isArray(apiProduct.images) ? apiProduct.images : []),
          seo: {
            metaTitle: apiProduct.seoMetaTitle || '',
            metaDescription: apiProduct.seoMetaDescription || '',
            seoAlt: apiProduct.seoAlt || '',
            index: apiProduct.seoIndex !== undefined ? apiProduct.seoIndex : true,
            follow: apiProduct.seoFollow !== undefined ? apiProduct.seoFollow : true,
            canonical: apiProduct.seoCanonical || '',
            schemaJson: apiProduct.seoSchemaJson || '',
          },
        };
        
        setProduct(transformedProduct);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || 'Failed to fetch product';
        setFetchError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-gray-500 text-lg">Loading product details...</p>
      </div>
    );
  }

  if (fetchError || !product) {
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

  const handleSubmit = async (formData: FormData) => {
    try {
      await updateProduct(id, formData);
      toast.success('Product updated successfully');
      router.push('/products');
    } catch (error) {
      // Re-throw so form component can catch and display
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-1">Update the details for "{product.name}"</p>
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
        product={product}
        categories={categories || []}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
