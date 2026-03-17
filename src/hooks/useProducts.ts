import { useState, useCallback, useEffect } from 'react';
import type { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

const STORAGE_KEY = 'admin_products';

function loadProducts(): Product[] {
  if (typeof window === 'undefined') return MOCK_PRODUCTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Product[]) : MOCK_PRODUCTS;
  } catch {
    return MOCK_PRODUCTS;
  }
}

function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProducts(loadProducts());
    } catch {
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newProduct: Product = {
        ...data,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => {
        const updated = [newProduct, ...prev];
        saveProducts(updated);
        return updated;
      });
      return newProduct;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProducts((prev) => {
        const updated = prev.map((p) =>
          p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
        );
        saveProducts(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        saveProducts(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { products, isLoading, error, fetchProducts, createProduct, updateProduct, deleteProduct };
}
