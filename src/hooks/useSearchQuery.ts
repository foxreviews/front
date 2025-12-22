import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/search.service';
import type { SearchFilters } from '../types/search';

/**
 * Hook pour la recherche d'entreprises avec cache intelligent
 */
export function useSearch(filters: SearchFilters) {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: () => searchService.search(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes pour les résultats de recherche
    enabled: !!(filters.categorie || filters.sous_categorie || filters.ville), // Ne cherche que si au moins un filtre
  });
}

/**
 * Hook pour charger les détails d'une entreprise
 */
export function useProDetail(proId: string) {
  return useQuery({
    queryKey: ['pro', proId],
    queryFn: () => searchService.getProLocalisation(proId),
    enabled: !!proId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
