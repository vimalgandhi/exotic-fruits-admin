import { useState, useCallback } from 'react';
import type { Category } from '@/types';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCategories(MOCK_CATEGORIES);
    } catch {
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newCategory: Category = {
        ...data,
        id: String(Date.now()),
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [newCategory, ...prev]);
      return newCategory;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c))
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { categories, isLoading, error, fetchCategories, createCategory, updateCategory, deleteCategory };
}
