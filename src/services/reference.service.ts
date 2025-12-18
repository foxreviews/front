import { apiClient } from "../api/search";
import type { Categorie, SousCategorie, Ville, PaginatedResponse } from "../types/reference";

/**
 * Service pour les données de référence (catégories, sous-catégories, villes)
 */
class ReferenceService {
  private categoriesCache: Categorie[] | null = null;
  private sousCategoriesCache: SousCategorie[] | null = null;
  private villesCache: Ville[] | null = null;

  /**
   * Récupère toutes les catégories
   */
  async getCategories(): Promise<Categorie[]> {
    if (this.categoriesCache) {
      return this.categoriesCache;
    }

    try {
      const { data } = await apiClient.get<Categorie[] | PaginatedResponse<Categorie>>("/categories/", {
        params: { page_size: 100 },
      });

      // Supporte à la fois un tableau simple et un format paginé
      const items = Array.isArray(data) ? data : data.results;

      this.categoriesCache = items;
      return items;
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      throw new Error("Impossible de charger les catégories");
    }
  }

  /**
   * Récupère toutes les sous-catégories pour une catégorie donnée
   * Le backend attend ici l'UUID de la catégorie (champ "categorie")
   */
  async getSousCategories(categorieId?: string): Promise<SousCategorie[]> {
    try {
      const { data } = await apiClient.get<SousCategorie[] | PaginatedResponse<SousCategorie>>("/sous-categories/", {
        params: { 
          page_size: 100,
          // On envoie l'UUID de la catégorie, pas le slug
          categorie: categorieId 
        },
      });

      const items = Array.isArray(data) ? data : data.results;

      if (!categorieId) {
        this.sousCategoriesCache = items;
      }

      return items;
    } catch (error) {
      console.error("Erreur lors du chargement des sous-catégories:", error);
      throw new Error("Impossible de charger les sous-catégories");
    }
  }

  /**
   * Récupère toutes les villes
   */
  async getVilles(search?: string): Promise<Ville[]> {
    if (this.villesCache && !search) {
      return this.villesCache;
    }

    try {
      const { data } = await apiClient.get<Ville[] | PaginatedResponse<Ville>>("/villes/", {
        params: { 
          page_size: 100,
          search 
        },
      });

      const items = Array.isArray(data) ? data : data.results;

      if (!search) {
        this.villesCache = items;
      }

      return items;
    } catch (error) {
      console.error("Erreur lors du chargement des villes:", error);
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
   * Vider tous les caches
   */
  clearCache(): void {
    this.categoriesCache = null;
    this.sousCategoriesCache = null;
    this.villesCache = null;
  }
}

export const referenceService = new ReferenceService();
