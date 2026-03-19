import { useState, useCallback, useEffect } from 'react';
import type { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import apiClient from '@/lib/api';
import { logger } from '@/lib/logger';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Product[] }>('/admin/products');
      setProducts(response.data.data ?? []);
    } catch (err) {
      logger.warn('useProducts/fetchProducts', 'Failed to fetch products — falling back to mock data', err);
      setError('Failed to fetch products');
      setProducts(MOCK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ data: Product }>('/products', data);
      const newProduct = response.data.data;
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      logger.error('useProducts/createProduct', 'Failed to create product', err);
      throw new Error('Failed to create product');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put<{ data: Product }>(`/products/${id}`, data);
      const updated = response.data.data;
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      logger.error('useProducts/updateProduct', `Failed to update product id=${id}`, err);
      throw new Error('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      logger.error('useProducts/deleteProduct', `Failed to delete product id=${id}`, err);
      throw new Error('Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { products, isLoading, error, fetchProducts, createProduct, updateProduct, deleteProduct };
}
