import { useState, useCallback } from 'react';
import type { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProducts(MOCK_PRODUCTS);
    } catch {
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newProduct: Product = {
        ...data,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p))
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { products, isLoading, error, fetchProducts, createProduct, updateProduct, deleteProduct };
}
