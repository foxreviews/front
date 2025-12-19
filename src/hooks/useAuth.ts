import { useState, useEffect, useCallback } from 'react';
import { authService, AuthError } from '../services/auth.service';
import type { LoginCredentials, RegisterData, AuthState } from '../types/auth';

/**
 * Hook pour gérer l'authentification
 * Fournit l'état d'authentification et les méthodes de connexion/déconnexion
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getUser(),
    token: authService.getToken(),
    loading: false,
    error: null,
  });

  // Initialise l'authentification au montage
  useEffect(() => {
    authService.initAuth();
  }, []);

  /**
   * Connexion utilisateur
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const { token, user } = await authService.login(credentials);
      
      setState({
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : 'Une erreur inattendue est survenue';
      
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      throw error;
    }
  }, []);

  /**
   * Inscription utilisateur
   */
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const { token, user } = await authService.register(data);
      
      setState({
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : 'Une erreur inattendue est survenue';
      
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      throw error;
    }
  }, []);

  /**
   * Déconnexion utilisateur
   */
  const logout = useCallback((): void => {
    authService.logout();
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Rafraîchit les données utilisateur
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!state.isAuthenticated) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const user = await authService.getCurrentUser();
      setState((prev) => ({
        ...prev,
        user,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : 'Impossible de rafraîchir les données utilisateur';
      
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      // Si l'erreur est 401, déconnecte l'utilisateur
      if (error instanceof AuthError && error.statusCode === 401) {
        logout();
      }
    }
  }, [state.isAuthenticated, logout]);

  /**
   * Efface l'erreur d'authentification
   */
  const clearError = useCallback((): void => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };
}
