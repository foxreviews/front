import { useCallback, useEffect, useState } from 'react';
import { searchService } from '../services/search.service';
import type { ProLocalisation } from '../types/search';

interface UseProLocalisationSeoArgs {
  categorieSlug?: string;
  sousCategorieSlug?: string;
  villeSlug?: string;
  entrepriseNom?: string;
}

interface UseProLocalisationSeoReturn {
  data: ProLocalisation | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProLocalisationSeo({
  categorieSlug,
  sousCategorieSlug,
  villeSlug,
  entrepriseNom,
}: UseProLocalisationSeoArgs): UseProLocalisationSeoReturn {
  const [data, setData] = useState<ProLocalisation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!categorieSlug || !sousCategorieSlug || !villeSlug || !entrepriseNom) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const seo = await searchService.getEntrepriseBySeo(
        categorieSlug,
        sousCategorieSlug,
        villeSlug,
        entrepriseNom
      );

      const proLocId: string | undefined =
        seo?.pro_localisation?.id ??
        (seo?.matches?.length === 1 ? seo.matches[0]?.pro_localisation_id : undefined);

      if (!proLocId) {
        if (seo?.error === 'Résolution ambiguë' || Array.isArray(seo?.matches)) {
          throw new Error("Résolution ambiguë: précisez l'entreprise");
        }
        throw new Error("Impossible d'identifier la pro-localisation");
      }

      const details = await searchService.getProLocalisation(proLocId);
      setData(details);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de charger les détails";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [categorieSlug, sousCategorieSlug, villeSlug, entrepriseNom]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
