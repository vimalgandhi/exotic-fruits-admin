'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import type { Category } from '@/types/category';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import ImageUpload from '@/components/ui/ImageUpload';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => Promise<void>;
  isLoading?: boolean;
}

export default function CategoryForm({ category, onSubmit, isLoading }: CategoryFormProps) {
  const router = useRouter();
  const [imageValue, setImageValue] = useState<string>(category?.image ?? '');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? '',
      slug: category?.slug ?? '',
      description: category?.description ?? '',
      status: category?.status ?? 'active',
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        status: category.status,
      });
      setImageValue(category.image ?? '');
    }
  }, [category, reset]);

  const nameValue = watch('name');

  const handleNameBlur = () => {
    if (!category && nameValue) {
      setValue('slug', slugify(nameValue));
    }
  };

  const handleFormSubmit = async (values: CategoryFormValues) => {
    await onSubmit({
      name: values.name,
      slug: values.slug,
      image: imageValue,
      description: values.description,
      status: values.status,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Category Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Category Name"
            required
            placeholder="e.g. Tropical Fruits"
            error={errors.name?.message}
            {...register('name', { onBlur: handleNameBlur })}
          />
          <Input
            label="Slug"
            required
            placeholder="e.g. tropical-fruits"
            error={errors.slug?.message}
            {...register('slug')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Optional description..."
            {...register('description')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            {...register('status')}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
          <ImageUpload
            value={imageValue}
            onChange={setImageValue}
            preview
            crop
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => router.push('/categories')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Button>
        <Button type="submit" isLoading={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}
