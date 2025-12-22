import { apiClient } from "../api/search";
import type { 
  Categorie, 
  CategorieDetail,
  SousCategorie, 
  SousCategorieAutocompleteItem,
  SousCategorieAutocompleteParams,
  Ville, 
  VilleAutocompleteParams,
  VilleAutocompleteResponse,
  VilleLookupParams,
  VilleStats,
  PaginatedResponse 
} from "../types/reference";

/**
 * Service pour les données de référence (catégories, sous-catégories, villes)
 */
class ReferenceService {
  private categoriesCache: Categorie[] | null = null;
  private sousCategoriesCache: SousCategorie[] | null = null;
  private villesCache: Ville[] | null = null;

  /**
   * Récupère toutes les catégories avec pagination
   */
  async getCategories(page: number = 1, pageSize: number = 500): Promise<PaginatedResponse<Categorie>> {
    try {
      const { data } = await apiClient.get<Categorie[] | PaginatedResponse<Categorie>>("/categories/", {
        params: { page, page_size: pageSize },
      });

      // Si l'API retourne un tableau simple, on le convertit en format paginé
      if (Array.isArray(data)) {
        return {
          count: data.length,
          next: null,
          previous: null,
          results: data,
        };
      }

      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      throw new Error("Impossible de charger les catégories");
    }
  }

  /**
   * Récupère toutes les catégories en mémoire (optimisé)
   * Un seul appel au lieu de boucle de pagination
   */
  async getAllCategories(): Promise<Categorie[]> {
    if (this.categoriesCache) {
      return this.categoriesCache;
    }

    try {
      // Un seul appel avec page_size élevé
      const response = await this.getCategories(1, 9999);
      this.categoriesCache = response.results;
      return this.categoriesCache;
    } catch (error) {
      console.error("Erreur lors du chargement de toutes les catégories:", error);
      throw new Error("Impossible de charger les catégories");
    }
  }

  /**
   * Récupère les sous-catégories avec pagination
   */
  async getSousCategories(
    categorieId?: string,
    page: number = 1,
    pageSize: number = 500
  ): Promise<PaginatedResponse<SousCategorie>> {
    try {
      const params: Record<string, any> = {
        page,
        page_size: pageSize,
      };

      if (categorieId) {
        params.categorie = categorieId;
      }

      const { data } = await apiClient.get<SousCategorie[] | PaginatedResponse<SousCategorie>>("/sous-categories/", {
        params,
      });

      if (Array.isArray(data)) {
        return {
          count: data.length,
          next: null,
          previous: null,
          results: data,
        };
      }

      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des sous-catégories:", error);
      throw new Error("Impossible de charger les sous-catégories");
    }
  }

  /**
   * Récupère toutes les sous-catégories en mémoire
   * Optimisé : un seul appel avec filtre par catégorie
   */
  async getAllSousCategories(categorieId?: string): Promise<SousCategorie[]> {
    // Si on demande toutes les sous-catégories et qu'elles sont en cache
    if (!categorieId && this.sousCategoriesCache) {
      return this.sousCategoriesCache;
    }

    try {
      // Un seul appel avec page_size élevé au lieu de boucle
      const response = await this.getSousCategories(categorieId, 1, 9999);
      const allSousCategories = response.results;

      // Cache seulement si on charge toutes les sous-catégories (sans filtre)
      if (!categorieId) {
        this.sousCategoriesCache = allSousCategories;
      }

      return allSousCategories;
    } catch (error) {
      console.error("Erreur lors du chargement des sous-catégories:", error);
      throw new Error("Impossible de charger les sous-catégories");
    }
  }

  /**
   * Récupère les villes avec pagination
   */
  async getVilles(
    search?: string,
    page: number = 1,
    pageSize: number = 500
  ): Promise<PaginatedResponse<Ville>> {
    try {
      const params: Record<string, any> = {
        page,
        page_size: pageSize,
      };
      
      if (search) {
        params.search = search;
      }

      const { data } = await apiClient.get<Ville[] | PaginatedResponse<Ville>>("/villes/", {
        params
      });

      // Si l'API retourne un tableau simple, on le convertit en format paginé
      if (Array.isArray(data)) {
        return {
          count: data.length,
          next: null,
          previous: null,
          results: data,
        };
      }

      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des villes:", error);
      throw new Error("Impossible de charger les villes");
    }
  }

  /**
   * Récupère toutes les villes en mémoire (optimisé)
   * ⚠️ DÉPRÉCIÉ : Utilisez useVilleAutocomplete() à la place pour de meilleures performances
   * Un seul appel au lieu de boucle de pagination
   */
  async getAllVillesInMemory(search?: string): Promise<Ville[]> {
    if (this.villesCache && !search) {
      return this.villesCache;
    }

    try {
      // Un seul appel avec page_size élevé
      const response = await this.getVilles(search, 1, 9999);
      const allVilles = response.results;

      if (!search) {
        this.villesCache = allVilles;
      }

      return allVilles;
    } catch (error) {
      console.error("Erreur lors du chargement de toutes les villes:", error);
      throw new Error("Impossible de charger les villes");
    }
  }



  /**
   * Filtre les sous-catégories par catégorie depuis le cache
   */
  getSousCategoriesByCategorie(categorieSlug: string): SousCategorie[] {
    if (!this.sousCategoriesCache) return [];
    return this.sousCategoriesCache.filter(
      (sc) => sc.categorie_slug === categorieSlug
    );
  }

  /**
   * Autocomplete de villes (endpoint optimisé avec cache et index trigram)
   */
  async autocompleteVilles(
    params: VilleAutocompleteParams
  ): Promise<VilleAutocompleteResponse> {
    try {
      const queryParams: Record<string, any> = {
        ...params,
        limit: params.limit ? Math.min(params.limit, 50) : 10,
      };

      const { data } = await apiClient.get<VilleAutocompleteResponse>(
        "/villes/autocomplete/",
        { params: queryParams }
      );

      // L'API peut retourner soit un tableau directement, soit un objet { results: [...] }
      if (Array.isArray(data)) {
        return { results: data };
      }
      
      return data || { results: [] };
    } catch (error) {
      console.error("Erreur lors de l'autocomplete des villes:", error);
      return { results: [] };
    }
  }

  /**
   * Lookup de ville (recherche exacte par ID ou slug)
   */
  async lookupVille(params: VilleLookupParams): Promise<Ville> {
    try {
      const { data } = await apiClient.get<Ville>("/villes/lookup/", {
        params,
      });
      return data;
    } catch (error) {
      console.error("Erreur lors du lookup de ville:", error);
      throw new Error("Ville introuvable");
    }
  }

  /**
   * Statistiques globales des villes
   */
  async getVilleStats(): Promise<VilleStats> {
    try {
      const { data } = await apiClient.get<VilleStats>("/villes/stats/");
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      throw new Error("Impossible de charger les statistiques des villes");
    }
  }

  /**
   * Autocomplete de sous-catégories (endpoint optimisé)
   */
  async autocompleteSousCategories(
    params: SousCategorieAutocompleteParams
  ): Promise<SousCategorieAutocompleteItem[]> {
    try {
      const queryParams = {
        ...params,
        limit: params.limit ? Math.min(params.limit, 50) : 10,
      };

      const { data } = await apiClient.get<{ results: SousCategorieAutocompleteItem[] }>(
        "/sous-categories/autocomplete/",
        { params: queryParams }
      );

      return data.results || [];
    } catch (error) {
      console.error("Erreur lors de l'autocomplete des sous-catégories:", error);
      throw new Error("Impossible de charger les suggestions de sous-catégories");
    }
  }

  /**
   * Récupère les détails d'une catégorie avec ses sous-catégories
   */
  async getCategorieDetail(id: string): Promise<CategorieDetail> {
    try {
      const { data } = await apiClient.get<CategorieDetail>(
        `/categories/${id}/`
      );
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement de la catégorie:", error);
      throw new Error("Impossible de charger la catégorie");
    }
  }

  /**
   * Vider tous les caches
   */
  clearCache(): void {
    this.categoriesCache = null;
    this.sousCategoriesCache = null;
    this.villesCache = null;
  }
}

export const referenceService = new ReferenceService();
