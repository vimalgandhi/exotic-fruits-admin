import { useState, useCallback, useEffect } from 'react';
import type { Category } from '@/types/category';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import apiClient from '@/lib/api';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Category[] }>('/categories');
      setCategories(response.data.data ?? []);
    } catch {
      setError('Failed to fetch categories');
      setCategories(MOCK_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ data: Category }>('/categories', data);
      const newCategory = response.data.data;
      setCategories((prev) => [newCategory, ...prev]);
      return newCategory;
    } catch {
      throw new Error('Failed to create category');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put<{ data: Category }>(`/categories/${id}`, data);
      const updated = response.data.data;
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch {
      throw new Error('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      throw new Error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { categories, isLoading, error, fetchCategories, createCategory, updateCategory, deleteCategory };
}
