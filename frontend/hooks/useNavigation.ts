import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Navigation } from '@/lib/types';

interface UseNavigationReturn {
  navigations: Navigation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNavigation(): UseNavigationReturn {
  const [navigations, setNavigations] = useState<Navigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNavigations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getNavigations();
      setNavigations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch navigations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavigations();
  }, []);

  return {
    navigations,
    loading,
    error,
    refetch: fetchNavigations,
  };
}
