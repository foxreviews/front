import { API_BASE_URL } from "../config/api";
import type { SearchFilters, SearchResponse } from "../types/search";

export async function searchEnterprises(
  filters: SearchFilters
): Promise<SearchResponse> {
  const params = new URLSearchParams();

  if (filters.categorie) params.append("categorie", filters.categorie);
  if (filters.sous_categorie) params.append("sous_categorie", filters.sous_categorie);
  if (filters.ville) params.append("ville", filters.ville);
  if (filters.page) params.append("page", String(filters.page));

  const res = await fetch(`${API_BASE_URL}/search/?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Erreur lors de la recherche");
  }

  return res.json();
}
