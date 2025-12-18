import { apiClient } from "../api/search";
import type { SearchFilters, SearchResponse, ProLocalisation } from "../types/search";

/**
 * Service de recherche d'entreprises
 * Encapsule toute la logique métier liée à la recherche
 */
class SearchService {
  /**
   * Recherche d'entreprises avec filtres
   * @param filters - Filtres de recherche (catégorie, sous-catégorie, ville, page)
   * @returns Résultats de recherche avec sponsors et résultats organiques
   */
  async search(filters: SearchFilters): Promise<SearchResponse> {
    try {
      const { data } = await apiClient.get<any>("/search/", {
        params: {
          categorie: filters.categorie,
          sous_categorie: filters.sous_categorie,
          ville: filters.ville,
          page: filters.page || 1,
        },
      });

      // Normalisation pour supporter le nouveau format de réponse
      const meta = data.meta ?? null;

      const sponsored: ProLocalisation[] = data.sponsored ?? [];
      const organic: ProLocalisation[] = data.organic ?? [];

      const total = meta?.total_results ?? data.total ?? organic.length + sponsored.length;
      const page = meta?.page ?? data.page ?? filters.page ?? 1;
      const page_size = meta?.page_size ?? data.page_size ?? organic.length;
      const has_next = meta?.has_next ?? data.has_next ?? false;

      const filtersNormalized = {
        categorie: (data.filters?.categorie as string | undefined) ?? null,
        sous_categorie: (data.filters?.sous_categorie as string | undefined) ?? null,
        ville: (data.filters?.ville as string | undefined) ?? null,
      };

      const normalized: SearchResponse = {
        sponsored,
        organic,
        total,
        page,
        page_size,
        has_next,
        filters: filtersNormalized,
        meta: meta ?? undefined,
      };

      return normalized;
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      throw new Error("Impossible de charger les résultats de recherche");
    }
  }

  /**
   * Recherche avec cache (optionnel pour optimisation future)
   */
  private cache = new Map<string, { data: SearchResponse; timestamp: number }>();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async searchWithCache(filters: SearchFilters): Promise<SearchResponse> {
    const cacheKey = JSON.stringify(filters);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    const data = await this.search(filters);
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }

  /**
   * Détails d'une pro-localisation (entreprise dans un contexte ville + sous-catégorie)
   */
  async getProLocalisation(id: string): Promise<ProLocalisation> {
    try {
      const { data } = await apiClient.get<ProLocalisation>(`/pro-localisations/${id}/`);
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des détails de l'entreprise:", error);
      throw new Error("Impossible de charger les détails de l'entreprise");
    }
  }

  /**
   * Vider le cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export de l'instance singleton
export const searchService = new SearchService();
