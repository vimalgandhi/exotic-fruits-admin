import { useState, useCallback } from 'react';
import {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '@/lib/api';
import { logger } from '@/lib/logger';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (page = 1, search = '', category = '') => {
    try {
      setLoading(true);
      const data = (await getAdminProducts(page, search, category)) as { data: Product[] };
      setProducts(data.data ?? []);
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      logger.error('useAdminProducts/fetchProducts', message, err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id: string) => {
    try {
      const data = (await getAdminProductById(id)) as { data: Product };
      return data.data;
    } catch (err) {
      logger.error('useAdminProducts/getProduct', `Failed to fetch product id=${id}`, err);
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch product');
    }
  }, []);

  const createProduct = useCallback(async (formData: FormData) => {
    try {
      setLoading(true);
      const data = await createAdminProduct(formData);
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      logger.error('useAdminProducts/createProduct', message, err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, formData: FormData) => {
    try {
      setLoading(true);
      const data = await updateAdminProduct(id, formData);
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      logger.error('useAdminProducts/updateProduct', `Failed to update product id=${id}`, err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await deleteAdminProduct(id);
        setProducts(products.filter((p) => p.id !== id));
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete product';
        logger.error('useAdminProducts/deleteProduct', `Failed to delete product id=${id}`, err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [products]
  );

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
