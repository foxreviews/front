import { useEffect, useState, useCallback } from "react";
import { searchService } from "../services/search.service";
import type { ProLocalisation } from "../types/search";

interface UseProLocalisationReturn {
  data: ProLocalisation | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProLocalisation(id: string | undefined): UseProLocalisationReturn {
  const [data, setData] = useState<ProLocalisation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const result = await searchService.getProLocalisation(id);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de charger les détails";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
