import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { ViewHistory } from '@/lib/types';

interface UseHistoryReturn {
  history: ViewHistory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHistory(limit?: number): UseHistoryReturn {
  const [history, setHistory] = useState<ViewHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getHistory(limit);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [limit]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  };
}
