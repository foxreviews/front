import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type { User } from '../types/auth';
import type { PaginatedResponse } from '../types/common';

/**
 * Réponse paginée pour les utilisateurs
 */
export type UserListResponse = PaginatedResponse<User>;

/**
 * Filtres pour la liste des utilisateurs
 */
export interface UserFilters {
  is_active?: boolean;
  role?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

/**
 * Classe d'erreur personnalisée pour les erreurs utilisateur
 */
export class UserError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'UserError';
    this.statusCode = statusCode;
  }
}

/**
 * Service de gestion des utilisateurs
 * Réservé aux administrateurs
 */
class UserService {
  /**
   * Récupère la liste des utilisateurs (admin uniquement)
   * @throws {UserError} Si la requête échoue
   */
  async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    try {
      const { data } = await apiClient.get<UserListResponse>(
        '/users/',
        { params: filters }
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les utilisateurs');
    }
  }

  /**
   * Récupère les détails d'un utilisateur (admin uniquement)
   * @throws {UserError} Si l'utilisateur n'existe pas
   */
  async getUser(id: string): Promise<User> {
    try {
      const { data } = await apiClient.get<User>(`/users/${id}/`);
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger l\'utilisateur');
    }
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: unknown, defaultMessage: string): UserError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        error?: string;
        detail?: string;
        message?: string;
      }>;

      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.message ||
        defaultMessage;

      return new UserError(errorMessage, axiosError.response?.status);
    }

    if (error instanceof UserError) {
      return error;
    }

    return new UserError(defaultMessage);
  }
}

export const userService = new UserService();
