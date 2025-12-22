import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '../services/client.service';
import type { 
  EntrepriseUpdateData, 
  UploadAvisRequest 
} from '../types/client';

/**
 * Hook pour charger le dashboard client
 */
export function useDashboard(entrepriseId: string | null) {
  return useQuery({
    queryKey: ['dashboard', entrepriseId],
    queryFn: () => clientService.getDashboard(entrepriseId!),
    enabled: !!entrepriseId,
    staleTime: 60 * 1000, // 1 minute - données en temps quasi-réel
    refetchInterval: 5 * 60 * 1000, // Refetch automatique toutes les 5 minutes
  });
}

/**
 * Hook pour charger les informations d'une entreprise
 */
export function useEntreprise(entrepriseId: string | null) {
  return useQuery({
    queryKey: ['entreprise', entrepriseId],
    queryFn: () => clientService.getEntreprise(entrepriseId!),
    enabled: !!entrepriseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour mettre à jour les informations d'une entreprise
 */
export function useUpdateEntreprise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      entrepriseId, 
      data 
    }: { 
      entrepriseId: string; 
      data: EntrepriseUpdateData 
    }) => clientService.updateEntreprise(entrepriseId, data),
    onSuccess: (_, variables) => {
      // Invalide et refetch les données de l'entreprise
      queryClient.invalidateQueries({ queryKey: ['entreprise', variables.entrepriseId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', variables.entrepriseId] });
    },
  });
}

/**
 * Hook pour charger les avis d'une entreprise
 */
export function useAvis(entrepriseId: string | null, page: number = 1) {
  return useQuery({
    queryKey: ['avis', entrepriseId, page],
    queryFn: () => clientService.getAvis(entrepriseId!, page),
    enabled: !!entrepriseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Garde les données pendant pagination
  });
}

/**
 * Hook pour uploader un avis
 */
export function useUploadAvis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      entrepriseId, 
      avisData 
    }: { 
      entrepriseId: string; 
      avisData: UploadAvisRequest 
    }) => clientService.uploadAvis(entrepriseId, avisData),
    onSuccess: (_, variables) => {
      // Invalide les avis et le dashboard
      queryClient.invalidateQueries({ queryKey: ['avis', variables.entrepriseId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', variables.entrepriseId] });
    },
  });
}

/**
 * Hook pour charger les détails d'un avis
 */
export function useAvisDetail(avisId: string) {
  return useQuery({
    queryKey: ['avis-detail', avisId],
    queryFn: () => clientService.getAvisDetail(avisId),
    enabled: !!avisId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook pour charger les sponsorisations
 */
export function useSponsorisations(isActive?: boolean) {
  return useQuery({
    queryKey: ['sponsorisations', isActive],
    queryFn: () => clientService.getSponsorisations(isActive),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
