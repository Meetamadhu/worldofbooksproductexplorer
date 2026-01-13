import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Category } from '@/lib/types';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategories(navigationSlug?: string): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = navigationSlug
        ? await api.getCategoriesByNavigation(navigationSlug)
        : await api.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [navigationSlug]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
