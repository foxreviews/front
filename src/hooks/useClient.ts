import { useState, useEffect, useCallback } from 'react';
import { clientService, ClientError } from '../services/client.service';
import type { AvisDecrypte, Dashboard, Entreprise, EntrepriseUpdateData } from '../types/client';

/**
 * Hook pour gérer le dashboard client
 */
export function useDashboard(entrepriseId: string | null) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await clientService.getDashboard(entrepriseId);
      setDashboard(data);
    } catch (err) {
      const errorMessage = err instanceof ClientError 
        ? err.message 
        : 'Impossible de charger le tableau de bord';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [entrepriseId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refresh = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refresh };
}

/**
 * Hook pour gérer les informations d'une entreprise
 */
export function useEntreprise(entrepriseId: string | null) {
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchEntreprise = useCallback(async () => {
    if (!entrepriseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await clientService.getEntreprise(entrepriseId);
      setEntreprise(data);
    } catch (err) {
      const errorMessage = err instanceof ClientError 
        ? err.message 
        : 'Impossible de charger les informations de l\'entreprise';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [entrepriseId]);

  useEffect(() => {
    fetchEntreprise();
  }, [fetchEntreprise]);

  const updateEntreprise = useCallback(async (updateData: EntrepriseUpdateData): Promise<boolean> => {
    if (!entrepriseId) return false;

    setUpdating(true);
    setError(null);

    try {
      const updatedData = await clientService.updateEntreprise(entrepriseId, updateData);
      setEntreprise(updatedData);
      return true;
    } catch (err) {
      const errorMessage = err instanceof ClientError 
        ? err.message 
        : 'Impossible de mettre à jour l\'entreprise';
      setError(errorMessage);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [entrepriseId]);

  const refresh = useCallback(() => {
    fetchEntreprise();
  }, [fetchEntreprise]);

  return { 
    entreprise, 
    loading, 
    error, 
    updating, 
    updateEntreprise, 
    refresh 
  };
}

/**
 * Hook pour gérer les avis d'une entreprise
 */
export function useAvis(entrepriseId: string | null) {
  const [avis, setAvis] = useState<AvisDecrypte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchAvis = useCallback(async (pageNum: number = 1) => {
    if (!entrepriseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await clientService.getAvis(entrepriseId, pageNum);
      
      if (pageNum === 1) {
        setAvis(data.results);
      } else {
        setAvis((prev) => [...prev, ...data.results]);
      }
      
      setHasMore(!!data.next);
      setPage(pageNum);
    } catch (err) {
      const errorMessage = err instanceof ClientError 
        ? err.message 
        : 'Impossible de charger les avis';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [entrepriseId]);

  useEffect(() => {
    fetchAvis(1);
  }, [fetchAvis]);

  const uploadAvis = useCallback(async (texteAvis: string): Promise<boolean> => {
    if (!entrepriseId) return false;

    setUploading(true);
    setError(null);

    try {
      await clientService.uploadAvis(entrepriseId, { texte_avis: texteAvis });
      // Recharge la liste des avis
      await fetchAvis(1);
      return true;
    } catch (err) {
      const errorMessage = err instanceof ClientError 
        ? err.message 
        : 'Impossible d\'envoyer l\'avis';
      setError(errorMessage);
      return false;
    } finally {
      setUploading(false);
    }
  }, [entrepriseId, fetchAvis]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchAvis(page + 1);
    }
  }, [loading, hasMore, page, fetchAvis]);

  const refresh = useCallback(() => {
    fetchAvis(1);
  }, [fetchAvis]);

  return { 
    avis, 
    loading, 
    error, 
    uploading, 
    hasMore, 
    uploadAvis, 
    loadMore, 
    refresh 
  };
}

/**
 * Hook pour gérer les sponsorisations
 */
export function useSponsorisations() {
  const [sponsorisations, setSponsorisations] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSponsorisations = useCallback(async (isActive?: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const data = await clientService.getSponsorisations(isActive);
      setSponsorisations(data);
    } catch (err) {
      const errorMessage = err instanceof ClientError 
        ? err.message 
        : 'Impossible de charger les sponsorisations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsorisations();
  }, [fetchSponsorisations]);

  const refresh = useCallback((isActive?: boolean) => {
    fetchSponsorisations(isActive);
  }, [fetchSponsorisations]);

  return { sponsorisations, loading, error, refresh };
}
