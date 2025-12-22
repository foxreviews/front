import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, AuthError } from '../services/auth.service';
import type { 
  AccountData, 
  AccountUpdateData, 
  PasswordResetRequest 
} from '../types/auth';

/**
 * Hook pour gérer le compte utilisateur
 * Fournit les méthodes pour récupérer et mettre à jour le profil
 */
export function useAccount() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  /**
   * Query pour récupérer les données du compte
   */
  const { 
    data: account, 
    isLoading, 
    refetch 
  } = useQuery<AccountData, Error>({
    queryKey: ['account'],
    queryFn: () => authService.getAccount(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Mutation pour mettre à jour le compte
   */
  const updateMutation = useMutation({
    mutationFn: (data: AccountUpdateData) => authService.updateAccount(data),
    onSuccess: (updatedAccount) => {
      // Mettre à jour le cache
      queryClient.setQueryData(['account'], updatedAccount);
      setError(null);
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof AuthError 
        ? err.message 
        : 'Une erreur est survenue lors de la mise à jour';
      setError(errorMessage);
    },
  });

  /**
   * Met à jour les informations du compte
   */
  const updateAccount = useCallback(
    async (data: AccountUpdateData): Promise<AccountData> => {
      setError(null);
      return updateMutation.mutateAsync(data);
    },
    [updateMutation]
  );

  return {
    account,
    isLoading,
    error,
    updateAccount,
    isUpdating: updateMutation.isPending,
    refetch,
  };
}

/**
 * Hook pour la réinitialisation de mot de passe
 */
export function usePasswordReset() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  /**
   * Mutation pour demander la réinitialisation
   */
  const resetMutation = useMutation({
    mutationFn: (request: PasswordResetRequest) => 
      authService.requestPasswordReset(request),
    onSuccess: () => {
      setSuccess(true);
      setError(null);
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof AuthError 
        ? err.message 
        : 'Une erreur est survenue';
      setError(errorMessage);
      setSuccess(false);
    },
  });

  /**
   * Demande de réinitialisation du mot de passe
   */
  const requestReset = useCallback(
    async (email: string): Promise<void> => {
      setError(null);
      setSuccess(false);
      await resetMutation.mutateAsync({ email });
    },
    [resetMutation]
  );

  /**
   * Réinitialise l'état
   */
  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    requestReset,
    isLoading: resetMutation.isPending,
    error,
    success,
    reset,
  };
}
