import { useMutation } from '@tanstack/react-query';
import { exportService } from '../services/export.service';
import { useState } from 'react';

/**
 * Hook pour gérer les exports de données
 */
export function useExport() {
  const [error, setError] = useState<string | null>(null);

  /**
   * Export des entreprises
   */
  const exportEntreprisesMutation = useMutation({
    mutationFn: () => exportService.exportEntreprises(),
    onSuccess: () => {
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
      console.error('Export entreprises error:', err);
    },
  });

  /**
   * Export des ProLocalisations
   */
  const exportProLocalisationsMutation = useMutation({
    mutationFn: () => exportService.exportProLocalisations(),
    onSuccess: () => {
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
      console.error('Export ProLocalisations error:', err);
    },
  });

  /**
   * Export des avis
   */
  const exportAvisMutation = useMutation({
    mutationFn: () => exportService.exportAvis(),
    onSuccess: () => {
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
      console.error('Export avis error:', err);
    },
  });

  /**
   * Export des pages WordPress
   */
  const exportWordPressMutation = useMutation({
    mutationFn: () => exportService.exportPagesWordPress(),
    onSuccess: () => {
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
      console.error('Export WordPress error:', err);
    },
  });

  /**
   * Export des statistiques
   */
  const exportStatsMutation = useMutation({
    mutationFn: () => exportService.getStats(),
    onSuccess: () => {
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
      console.error('Export stats error:', err);
    },
  });

  return {
    error,
    exportEntreprises: exportEntreprisesMutation.mutateAsync,
    exportProLocalisations: exportProLocalisationsMutation.mutateAsync,
    exportAvis: exportAvisMutation.mutateAsync,
    exportWordPress: exportWordPressMutation.mutateAsync,
    exportStats: exportStatsMutation.mutateAsync,
    isExportingEntreprises: exportEntreprisesMutation.isPending,
    isExportingProLocalisations: exportProLocalisationsMutation.isPending,
    isExportingAvis: exportAvisMutation.isPending,
    isExportingWordPress: exportWordPressMutation.isPending,
    isExportingStats: exportStatsMutation.isPending,
    isExporting:
      exportEntreprisesMutation.isPending ||
      exportProLocalisationsMutation.isPending ||
      exportAvisMutation.isPending ||
      exportWordPressMutation.isPending ||
      exportStatsMutation.isPending,
  };
}
