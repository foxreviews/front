import { useEffect, useState, useCallback } from "react";
import { searchService } from "../services/search.service";
import type { SearchFilters, SearchResponse } from "../types/search";

interface UseSearchReturn {
  data: SearchResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour la recherche d'entreprises
 * Gère l'état, le chargement et les erreurs automatiquement
 */
export function useSearch(filters: SearchFilters): UseSearchReturn {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await searchService.search(filters);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Impossible de charger les résultats";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error,
    refetch: fetchData 
  };
}
