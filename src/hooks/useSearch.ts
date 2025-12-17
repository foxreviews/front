import { useEffect, useState } from "react";
import { searchEnterprises } from "../api/search";
import type { SearchFilters, SearchResponse } from "../types/search";

export function useSearch(filters: SearchFilters) {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    searchEnterprises(filters)
      .then(setData)
      .catch(() => setError("Impossible de charger les résultats"))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
}
