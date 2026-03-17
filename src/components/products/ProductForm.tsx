'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import type { Product, PriceListItem, Category } from '@/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import ImageUpload from '@/components/ui/ImageUpload';
import PriceListManager from '@/components/products/PriceListManager';
import SeoSection from '@/components/products/SeoSection';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  salePrice: z.coerce.number().min(0).optional().or(z.literal('')),
  stock: z.coerce.number().int().min(0, 'Stock must be a non-negative integer'),
  categoryId: z.string().min(1, 'Category is required'),
  originCountry: z.string().optional(),
  foodType: z.string().optional(),
  stockStatus: z.enum(['In Stock', 'Out Stock', 'Out of Stock']).optional(),
  status: z.enum(['active', 'inactive', 'draft']),
  featured: z.boolean().optional(),
  // SEO fields
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  seoAlt: z.string().optional(),
  seoIndex: z.boolean().optional(),
  seoFollow: z.boolean().optional(),
  seoCanonical: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  seoOgTitle: z.string().optional(),
  seoOgDescription: z.string().optional(),
  seoOgImage: z.string().optional(),
  seoTwitterTitle: z.string().optional(),
  seoTwitterDescription: z.string().optional(),
  seoTwitterImage: z.string().optional(),
  seoSchemaJson: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isLoading?: boolean;
}

export default function ProductForm({ product, categories, onSubmit, isLoading }: ProductFormProps) {
  const router = useRouter();
  const [pricingExpanded, setPricingExpanded] = useState(true);
  const [imageValue, setImageValue] = useState<string>(product?.images?.[0] ?? '');
  const [priceList, setPriceList] = useState<PriceListItem[]>(product?.pricelist ?? []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      slug: product?.slug ?? '',
      description: product?.description ?? '',
      price: product?.price ?? 0,
      salePrice: product?.salePrice ?? '',
      stock: product?.stock ?? 0,
      categoryId: product?.categoryId ?? '',
      originCountry: product?.originCountry ?? '',
      foodType: product?.foodType ?? '',
      stockStatus: (product?.stockStatus as ProductFormValues['stockStatus']) ?? 'In Stock',
      status: product?.status ?? 'active',
      featured: product?.featured ?? false,
      seoMetaTitle: product?.seo?.metaTitle ?? '',
      seoMetaDescription: product?.seo?.metaDescription ?? '',
      seoAlt: product?.seo?.seoAlt ?? '',
      seoIndex: product?.seo?.index ?? true,
      seoFollow: product?.seo?.follow ?? true,
      seoCanonical: product?.seo?.canonical ?? '',
      seoOgTitle: product?.seo?.ogTitle ?? '',
      seoOgDescription: product?.seo?.ogDescription ?? '',
      seoOgImage: product?.seo?.ogImage ?? '',
      seoTwitterTitle: product?.seo?.twitterTitle ?? '',
      seoTwitterDescription: product?.seo?.twitterDescription ?? '',
      seoTwitterImage: product?.seo?.twitterImage ?? '',
      seoSchemaJson: product?.seo?.schemaJson ?? '',
    },
  });

  const nameValue = watch('name');

  const handleNameBlur = () => {
    if (!product && nameValue) {
      setValue('slug', slugify(nameValue));
    }
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    const selectedCategory = categories.find((c) => c.id === values.categoryId);
    await onSubmit({
      name: values.name,
      slug: values.slug,
      description: values.description,
      price: values.price,
      salePrice: values.salePrice ? Number(values.salePrice) : undefined,
      stock: values.stock,
      category: selectedCategory?.name ?? '',
      categoryId: values.categoryId,
      originCountry: values.originCountry,
      foodType: values.foodType,
      stockStatus: values.stockStatus,
      pricelist: priceList,
      images: imageValue ? [imageValue] : [],
      status: values.status,
      featured: values.featured ?? false,
      seo: {
        metaTitle: values.seoMetaTitle,
        metaDescription: values.seoMetaDescription,
        seoAlt: values.seoAlt,
        index: values.seoIndex ?? true,
        follow: values.seoFollow ?? true,
        canonical: values.seoCanonical || undefined,
        ogTitle: values.seoOgTitle,
        ogDescription: values.seoOgDescription,
        ogImage: values.seoOgImage,
        twitterTitle: values.seoTwitterTitle,
        twitterDescription: values.seoTwitterDescription,
        twitterImage: values.seoTwitterImage,
        schemaJson: values.seoSchemaJson,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            required
            placeholder="e.g. Dragon Fruit"
            error={errors.name?.message}
            {...register('name', { onBlur: handleNameBlur })}
          />
          <Input
            label="Slug"
            required
            placeholder="e.g. dragon-fruit"
            error={errors.slug?.message}
            {...register('slug')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            className={`block w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
            }`}
            placeholder="Describe the product..."
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Price (USD)"
            required
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price')}
          />
          <Input
            label="Sale Price (USD)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.salePrice?.message}
            {...register('salePrice')}
          />
          <Input
            label="Stock Quantity"
            required
            type="number"
            min="0"
            step="1"
            placeholder="0"
            error={errors.stock?.message}
            {...register('stock')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.categoryId ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              {...register('categoryId')}
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              {...register('status')}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              {...register('stockStatus')}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out Stock">Out Stock</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Origin Country"
            placeholder="e.g. Thailand"
            {...register('originCountry')}
          />
          <Input
            label="Food Type"
            placeholder="e.g. Regular, Organic, Premium"
            {...register('foodType')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
          <ImageUpload
            value={imageValue}
            onChange={setImageValue}
            preview
            crop
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            {...register('featured')}
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Featured product
          </label>
        </div>
      </div>

      {/* Price List / Unit Sizes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          type="button"
          className="w-full flex items-center justify-between p-6 text-left"
          onClick={() => setPricingExpanded((v) => !v)}
        >
          <div>
            <h2 className="text-base font-semibold text-gray-900">Unit Sizes &amp; Pricing</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Add multiple unit sizes (e.g. 400g, 500g, 600g) with individual pricing and discounts
            </p>
          </div>
          {pricingExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
          )}
        </button>

        {pricingExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100 pt-4">
            <PriceListManager items={priceList} onChange={setPriceList} />
          </div>
        )}
      </div>

      {/* Advanced SEO */}
      <SeoSection register={register} errors={errors} />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => router.push('/products')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <Button type="submit" isLoading={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
