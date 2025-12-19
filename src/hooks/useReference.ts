import { useEffect, useState } from "react";
import { referenceService } from "../services/reference.service";
import type { Categorie, SousCategorie, Ville } from "../types/reference";

/**
 * Hook pour charger les catégories
 */
export function useCategories() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    referenceService
      .getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}

/**
 * Hook pour charger les sous-catégories
 * On attend ici l'UUID de la catégorie (id backend), pas le slug
 */
export function useSousCategories(categorieId?: string) {
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorieId) {
      setSousCategories([]);
      return;
    }

    setLoading(true);
    setError(null);

    referenceService
      .getSousCategories(categorieId)
      .then(setSousCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categorieId]);

  return { sousCategories, loading, error };
}

/**
 * Hook pour charger les villes
 */
export function useVilles(search?: string) {
  const [villes, setVilles] = useState<Ville[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    referenceService
      .getVilles(search)
      .then(setVilles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search]);

  return { villes, loading, error };
}

/**
 * Hook combiné pour charger toutes les données de référence
 */
export function useReference() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [villes, setVilles] = useState<Ville[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      referenceService.getCategories(),
      referenceService.getSousCategories(),
      referenceService.getVilles()
    ])
      .then(([cats, sousCats, vills]) => {
        setCategories(cats);
        setSousCategories(sousCats);
        setVilles(vills);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, sousCategories, villes, loading, error };
}
