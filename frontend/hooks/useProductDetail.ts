import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';

interface UseProductDetailReturn {
  product: Product | null;
  recommendations: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProductDetail(productId: string): UseProductDetailReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProduct(productId);
      setProduct(data);

      // Fetch recommendations (same category)
      if (data.categoryId) {
        const recs = await api.getProducts({
          categoryId: data.categoryId,
          limit: 4,
        });
        // Filter out current product
        setRecommendations(recs.data.filter((p: Product) => p.id !== productId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  return {
    product,
    recommendations,
    loading,
    error,
    refetch: fetchProductDetail,
  };
}
