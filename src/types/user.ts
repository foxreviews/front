/**
 * Types pour la gestion des utilisateurs
 */

import type { UserRole } from './common';

/**
 * Filtres pour la liste des utilisateurs
 */
export interface UserFilters {
  /** Filtrer par rôle */
  role?: UserRole;
  /** Filtrer par statut actif */
  is_active?: boolean;
  /** Pagination */
  page?: number;
  /** Nombre d'éléments par page */
  page_size?: number;
}
