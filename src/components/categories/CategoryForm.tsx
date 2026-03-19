'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, AlertCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { toast } from 'sonner';
import type { Category } from '@/types/category';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import ImageUpload from '@/components/ui/ImageUpload';

type CategoryFormValues = {
  name: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive';
};

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  isFetching?: boolean;
}

export default function CategoryForm({ category, onSubmit, isLoading, isFetching }: CategoryFormProps) {
  const router = useRouter();
  const [imageValue, setImageValue] = useState<File | string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<CategoryFormValues>({
    mode: "onChange",
    defaultValues: {
      name: category?.name ?? '',
      slug: category?.slug ?? '',
      description: category?.description ?? '',
      status: category?.status ?? 'active',
    },
  });

  useEffect(() => {
    if (category) {
      const validStatus = category.status && ['active', 'inactive'].includes(category.status.toLowerCase())
        ? category.status.toLowerCase() as 'active' | 'inactive'
        : 'active';
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        status: validStatus,
      });
      setImageValue(category.image || null);
    }
  }, [category, reset]);

  const nameValue = watch('name');

  useEffect(() => {
    // Auto-generate slug from name when category is new
    if (!category && nameValue) {
      setValue('slug', slugify(nameValue));
    }
  }, [nameValue, category, setValue]);

  const handleFormSubmit = async (values: CategoryFormValues) => {
    setSubmissionError(null);
    setImageError(null);

    // Validate image for new categories
    if (!category && !imageValue) {
      setImageError('Category image is required');
      toast.error('Please upload a category image');
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('slug', values.slug);
    formData.append('description', values.description || '');
    formData.append('status', values.status);
    if (imageValue && imageValue instanceof File) {
      formData.append('image', imageValue);
    }

    try {
      await onSubmit(formData as any);
    } catch (err: any) {
      console.error('CategoryForm submission error:', err);
      let errorMessage = "Failed to save category";
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setSubmissionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500 text-lg">Loading category...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Validation Errors Summary */}
      {isSubmitted && Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-4 flex gap-3 shadow-sm">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900 mb-1">
              Please fix the following errors:
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(errors).map(([field, error]: any) => (
                <li key={field}>• {error?.message || `${field} is invalid`}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-red-400 hover:text-red-600 flex-shrink-0 text-xs font-medium whitespace-nowrap"
          >
            Scroll up
          </button>
        </div>
      )}

      {/* Error Alert */}
      {submissionError && (
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-4 flex gap-3 shadow-sm">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900 mb-1">Error</h3>
            <p className="text-sm text-red-700">{submissionError}</p>
          </div>
          <button
            type="button"
            onClick={() => setSubmissionError(null)}
            className="text-red-400 hover:text-red-600 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Category Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Category Name"
            required
            placeholder="e.g. Tropical Fruits"
            error={errors.name?.message}
            {...register('name', { 
              required: 'Category name is required',
              minLength: { value: 1, message: 'Category name is required' }
            })}
          />
          <Input
            label="Slug"
            required
            placeholder="e.g. tropical-fruits"
            error={errors.slug?.message}
            {...register('slug', { 
              required: 'Slug is required',
              minLength: { value: 1, message: 'Slug is required' }
            })}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
              errors.status
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
            {...register('status', { 
              required: 'Status is required',
              validate: (val) => ['active', 'inactive'].includes(val) || 'Invalid status value'
            })}
          >
            <option value="">Select status...</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">
              {errors.status.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image {!category && <span className="text-red-500">*</span>}
          </label>
          <ImageUpload
            value={imageValue}
            onChange={(file: any) => {
              setImageValue(file instanceof File ? file : null);
              setImageError(null);
            }}
            preview
          />
          {imageError && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {imageError}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => router.push('/categories')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={isSubmitted && Object.keys(errors).length > 0} className={isSubmitted && Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed" : ""}>
          <Save className="h-4 w-4 mr-2" />
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}
