'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { slugify } from '@/lib/utils';
import type { Category } from '@/types';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => Promise<void>;
  isLoading?: boolean;
}

export default function CategoryModal({
  isOpen,
  onClose,
  category,
  onSubmit,
  isLoading,
}: CategoryModalProps) {
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
      name: '',
      slug: '',
      description: '',
      image: '',
      status: 'active',
    },
  });

  const nameValue = watch('name');

  useEffect(() => {
    if (isOpen) {
      reset({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        description: category?.description ?? '',
        image: category?.image ?? '',
        status: category?.status ?? 'active',
      });
    }
  }, [isOpen, category, reset]);

  const handleNameBlur = () => {
    if (!category && nameValue) {
      setValue('slug', slugify(nameValue));
    }
  };

  const handleFormSubmit = async (values: CategoryFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={2}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Optional description..."
            {...register('description')}
          />
        </div>
        <Input
          label="Image URL"
          placeholder="https://example.com/category.jpg"
          {...register('image')}
        />
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

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {category ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
