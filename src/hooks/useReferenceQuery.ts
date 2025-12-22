import { useQuery, useQueryClient } from '@tanstack/react-query';
import { referenceService } from '../services/reference.service';

/**
 * Hook pour charger les catégories avec TanStack Query
 * Les données sont automatiquement mises en cache
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => referenceService.getAllCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes - les catégories changent rarement
  });
}

/**
 * Hook pour charger les sous-catégories avec cache par catégorie
 */
export function useSousCategories(categorieId?: string) {
  return useQuery({
    queryKey: ['sous-categories', categorieId],
    queryFn: () => referenceService.getAllSousCategories(categorieId!),
    enabled: !!categorieId, // Ne lance la requête que si categorieId existe
    staleTime: 20 * 60 * 1000, // 20 minutes
  });
}

/**
 * Hook pour charger toutes les villes avec pagination
 */
export function useVilles(page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: ['villes', page, pageSize],
    queryFn: () => referenceService.getVilles(undefined, page, pageSize),
    staleTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: (previousData) => previousData, // Garde les anciennes données pendant le chargement
  });
}

/**
 * Hook pour l'autocomplete des villes (données fraîches)
 */
export function useVilleAutocomplete(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['villes', 'autocomplete', query],
    queryFn: () => referenceService.autocompleteVilles({ q: query }),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes pour autocomplete
  });
}

/**
 * Hook pour l'autocomplete des sous-catégories
 */
export function useSousCategorieAutocomplete(
  query: string,
  categorieId?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['sous-categories', 'autocomplete', query, categorieId],
    queryFn: () => referenceService.autocompleteSousCategories({ q: query, categorie: categorieId }),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook pour lookup de ville (recherche exacte)
 */
export function useVilleLookup(identifier: string, bySlug: boolean = false) {
  return useQuery({
    queryKey: ['ville', 'lookup', identifier, bySlug],
    queryFn: () => referenceService.lookupVille(bySlug ? { slug: identifier } : { id: identifier }),
    enabled: !!identifier,
    staleTime: 60 * 60 * 1000, // 1 heure - les villes changent très rarement
  });
}

/**
 * Hook pour les statistiques des villes
 */
export function useVilleStats() {
  return useQuery({
    queryKey: ['villes', 'stats'],
    queryFn: () => referenceService.getVilleStats(),
    staleTime: 60 * 60 * 1000, // 1 heure
  });
}

/**
 * Hook pour obtenir les détails d'une catégorie avec ses sous-catégories
 */
export function useCategorieDetail(categorieId: string) {
  return useQuery({
    queryKey: ['categorie', categorieId],
    queryFn: () => referenceService.getCategorieDetail(categorieId),
    enabled: !!categorieId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook pour prefetch des données critiques
 * À utiliser sur la page d'accueil ou au mount de l'app
 */
export function usePrefetchCriticalData() {
  const queryClient = useQueryClient();

  const prefetchCategories = () =>
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: () => referenceService.getAllCategories(),
    });

  const prefetchPopularVilles = () =>
    queryClient.prefetchQuery({
      queryKey: ['villes', 'popular'],
      queryFn: () => referenceService.getVilles(undefined, 1, 10),
    });

  return {
    prefetchCategories,
    prefetchPopularVilles,
  };
}
