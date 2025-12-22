import { useState, useEffect, useCallback } from "react";
import { referenceService } from "../services/reference.service";
import type { VilleAutocompleteItem, SousCategorie } from "../types/reference";

/**
 * Hook pour l'autocomplete de villes (optimisé avec debounce)
 * Utilise l'endpoint /villes/autocomplete/ pour de meilleures performances
 */
export function useVilleAutocomplete(
  query: string,
  filters?: {
    code_postal?: string;
    region?: string;
    departement?: string;
  },
  debounceMs: number = 300
) {
  const [results, setResults] = useState<VilleAutocompleteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ne pas chercher si la requête est trop courte
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Debounce: attendre que l'utilisateur arrête de taper
    const timeoutId = setTimeout(() => {
      referenceService
        .autocompleteVilles({ q: query, ...filters, limit: 10 })
        .then((response) => setResults(response?.results || []))
        .catch((err) => {
          setError(err.message);
          setResults([]); // Assurer qu'on a un tableau vide en cas d'erreur
        })
        .finally(() => setLoading(false));
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, JSON.stringify(filters), debounceMs]);

  return { results, loading, error };
}

/**
 * Hook pour l'autocomplete de sous-catégories (optimisé avec debounce)
 * Utilise l'endpoint /sous-categories/autocomplete/
 */
export function useSousCategorieAutocomplete(
  query: string,
  categorieId?: string,
  debounceMs: number = 300
) {
  const [results, setResults] = useState<SousCategorie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ne pas chercher si la requête est trop courte
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Debounce: attendre que l'utilisateur arrête de taper
    const timeoutId = setTimeout(() => {
      referenceService
        .autocompleteSousCategories({ q: query, categorie: categorieId, limit: 10 })
        .then(setResults)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, categorieId, debounceMs]);

  return { results, loading, error };
}

/**
 * Hook pour le lookup de ville (recherche exacte)
 */
export function useVilleLookup(idOrSlug?: string, isSlug: boolean = false) {
  const [ville, setVille] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(
    async (id: string, slug: boolean = isSlug) => {
      setLoading(true);
      setError(null);
      try {
        const result = await referenceService.lookupVille(slug ? { slug: id } : { id });
        setVille(result);
        return result;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isSlug]
  );

  useEffect(() => {
    if (idOrSlug) {
      lookup(idOrSlug, isSlug);
    }
  }, [idOrSlug, isSlug, lookup]);

  return { ville, loading, error, lookup };
}

/**
 * Hook pour les statistiques des villes
 */
export function useVilleStats() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    referenceService
      .getVilleStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}
