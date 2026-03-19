import { useState, useCallback, useEffect } from 'react';
import type { Category } from '@/types/category';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import apiClient from '@/lib/api';
import { logger } from '@/lib/logger';

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
    } catch (err) {
      logger.warn('useCategories/fetchCategories', 'Failed to fetch categories — falling back to mock data', err);
      setError('Failed to fetch categories');
      setCategories(MOCK_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ data: Category }>('/categories', formData);
      const newCategory = response.data.data;
      setCategories((prev) => [newCategory, ...prev]);
      return newCategory;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create category';
      logger.error('useCategories/createCategory', errorMessage, err);
      throw new Error(errorMessage);
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
    } catch (err: any) {
      const errorMessage = err?.message || `Failed to update category id=${id}`;
      logger.error('useCategories/updateCategory', errorMessage, err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      logger.error('useCategories/deleteCategory', `Failed to delete category id=${id}`, err);
      throw new Error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { categories, isLoading, error, fetchCategories, createCategory, updateCategory, deleteCategory };
}
