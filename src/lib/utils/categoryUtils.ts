import type { Category } from '@/types/category';

export function generateCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateCategory(data: Partial<Category>): string | null {
  if (!data.name?.trim()) return 'Category name is required';
  if (!data.slug?.trim()) return 'Slug is required';
  return null;
}

export function formatCategoryData(
  data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>
): Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'> {
  return {
    name: data.name.trim(),
    slug: data.slug.trim(),
    image: data.image ?? '',
    description: data.description?.trim(),
    parentId: data.parentId,
    status: data.status,
  };
}
