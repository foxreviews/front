import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { trackingService, TrackingError } from '../services/tracking.service';
import type {
  TrackClickRequest,
  TrackViewRequest,
  TrackingStats,
} from '../types/tracking';

/**
 * Hook pour gérer le tracking analytics
 */
export function useTracking(entrepriseId?: string) {
  const [error, setError] = useState<string | null>(null);

  /**
   * Query pour récupérer les statistiques
   */
  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery<TrackingStats, Error>({
    queryKey: ['tracking-stats', entrepriseId],
    queryFn: () => trackingService.getStats(entrepriseId),
    enabled: !!entrepriseId, // Ne charger que si on a un entrepriseId
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Mutation pour tracker un clic
   */
  const clickMutation = useMutation({
    mutationFn: (request: TrackClickRequest) =>
      trackingService.trackClick(request),
    onError: (err: Error) => {
      const errorMessage =
        err instanceof TrackingError ? err.message : 'Erreur de tracking';
      setError(errorMessage);
      console.error('Track click error:', err);
    },
  });

  /**
   * Mutation pour tracker une vue
   */
  const viewMutation = useMutation({
    mutationFn: (request: TrackViewRequest) =>
      trackingService.trackView(request),
    onError: (err: Error) => {
      const errorMessage =
        err instanceof TrackingError ? err.message : 'Erreur de tracking';
      setError(errorMessage);
      console.error('Track view error:', err);
    },
  });

  /**
   * Track un clic
   */
  const trackClick = useCallback(
    async (request: TrackClickRequest): Promise<void> => {
      setError(null);
      try {
        await clickMutation.mutateAsync(request);
      } catch {
        // L'erreur est déjà gérée dans onError
      }
    },
    [clickMutation]
  );

  /**
   * Track une vue
   */
  const trackView = useCallback(
    async (request: TrackViewRequest): Promise<void> => {
      setError(null);
      try {
        await viewMutation.mutateAsync(request);
      } catch {
        // L'erreur est déjà gérée dans onError
      }
    },
    [viewMutation]
  );

  /**
   * Track un clic de manière silencieuse
   */
  const trackClickSilent = useCallback(
    async (request: TrackClickRequest): Promise<void> => {
      await trackingService.trackClickSilent(request);
    },
    []
  );

  /**
   * Track une vue de manière silencieuse
   */
  const trackViewSilent = useCallback(
    async (request: TrackViewRequest): Promise<void> => {
      await trackingService.trackViewSilent(request);
    },
    []
  );

  return {
    stats,
    isLoading,
    error,
    trackClick,
    trackView,
    trackClickSilent,
    trackViewSilent,
    isTrackingClick: clickMutation.isPending,
    isTrackingView: viewMutation.isPending,
    refetch,
  };
}

/**
 * Hook pour tracker automatiquement la vue d'un élément
 * Déclenche le tracking quand le composant est monté
 */
export function useTrackView(request: TrackViewRequest, enabled: boolean = true) {
  const { trackViewSilent } = useTracking();

  useEffect(() => {
    if (enabled && request.entreprise_id) {
      trackViewSilent(request);
    }
  }, [enabled, request, trackViewSilent]);
}

/**
 * Hook pour créer un handler de clic avec tracking
 */
export function useTrackClick() {
  const { trackClickSilent } = useTracking();

  const createClickHandler = useCallback(
    (request: TrackClickRequest, callback?: () => void) => {
      return async () => {
        await trackClickSilent(request);
        if (callback) {
          callback();
        }
      };
    },
    [trackClickSilent]
  );

  return { createClickHandler };
}
