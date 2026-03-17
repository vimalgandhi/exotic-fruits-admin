import { useState, useCallback, useEffect } from 'react';
import type { Category } from '@/types';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

const STORAGE_KEY = 'admin_categories';

function loadCategories(): Category[] {
  if (typeof window === 'undefined') return MOCK_CATEGORIES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Category[]) : MOCK_CATEGORIES;
  } catch {
    return MOCK_CATEGORIES;
  }
}

function saveCategories(categories: Category[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCategories(loadCategories());
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setCategories(loadCategories());
    } catch {
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newCategory: Category = {
        ...data,
        id: String(Date.now()),
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => {
        const updated = [newCategory, ...prev];
        saveCategories(updated);
        return updated;
      });
      return newCategory;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setCategories((prev) => {
        const updated = prev.map((c) =>
          c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
        );
        saveCategories(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setCategories((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        saveCategories(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { categories, isLoading, error, fetchCategories, createCategory, updateCategory, deleteCategory };
}
