import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';

interface UseProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: string;
}

interface UseProductsReturn {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(params: UseProductsParams = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProducts(params);
      setProducts(response.data);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params.page, params.limit, params.search, params.categoryId, params.sortBy]);

  return {
    products,
    total,
    loading,
    error,
    refetch: fetchProducts,
  };
}
