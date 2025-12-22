/**
 * Hook pour gérer les permissions basées sur les rôles utilisateur
 */

import { useMemo, type ComponentType } from 'react';
import { useAuth } from './useAuth';
import type { UserRole } from '../types/common';

/**
 * Permissions disponibles dans l'application
 */
export const Permission = {
  // Permissions entreprises
  VIEW_ENTREPRISE: 'view_entreprise',
  CREATE_ENTREPRISE: 'create_entreprise',
  UPDATE_ENTREPRISE: 'update_entreprise',
  DELETE_ENTREPRISE: 'delete_entreprise',

  // Permissions avis
  VIEW_AVIS: 'view_avis',
  UPLOAD_AVIS: 'upload_avis',

  // Permissions billing
  VIEW_BILLING: 'view_billing',
  CREATE_CHECKOUT: 'create_checkout',
  VIEW_INVOICES: 'view_invoices',

  // Permissions tracking
  VIEW_STATS: 'view_stats',

  // Permissions exports
  EXPORT_DATA: 'export_data',

  // Permissions ProLocalisations
  VIEW_PROLOCALISATION: 'view_prolocalisation',
  MANAGE_PROLOCALISATION: 'manage_prolocalisation',

  // Permissions sponsorisations
  VIEW_SPONSORISATION: 'view_sponsorisation',
  MANAGE_SPONSORISATION: 'manage_sponsorisation',

  // Permissions admin
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  ACCESS_ADMIN: 'access_admin',
} as const;

export type PermissionType = typeof Permission[keyof typeof Permission];

/**
 * Mapping des rôles vers leurs permissions
 */
const ROLE_PERMISSIONS: Record<UserRole, PermissionType[]> = {
  VISITEUR: [Permission.VIEW_ENTREPRISE],

  CLIENT: [
    Permission.VIEW_ENTREPRISE,
    Permission.VIEW_AVIS,
    Permission.UPLOAD_AVIS,
    Permission.VIEW_BILLING,
    Permission.CREATE_CHECKOUT,
    Permission.VIEW_INVOICES,
    Permission.VIEW_STATS,
    Permission.VIEW_PROLOCALISATION,
    Permission.VIEW_SPONSORISATION,
  ],

  MANAGER: [
    Permission.VIEW_ENTREPRISE,
    Permission.CREATE_ENTREPRISE,
    Permission.UPDATE_ENTREPRISE,
    Permission.VIEW_AVIS,
    Permission.UPLOAD_AVIS,
    Permission.VIEW_BILLING,
    Permission.CREATE_CHECKOUT,
    Permission.VIEW_INVOICES,
    Permission.VIEW_STATS,
    Permission.VIEW_PROLOCALISATION,
    Permission.MANAGE_PROLOCALISATION,
    Permission.VIEW_SPONSORISATION,
    Permission.MANAGE_SPONSORISATION,
    Permission.EXPORT_DATA,
  ],

  ADMIN: [
    Permission.VIEW_ENTREPRISE,
    Permission.CREATE_ENTREPRISE,
    Permission.UPDATE_ENTREPRISE,
    Permission.DELETE_ENTREPRISE,
    Permission.VIEW_AVIS,
    Permission.UPLOAD_AVIS,
    Permission.VIEW_BILLING,
    Permission.CREATE_CHECKOUT,
    Permission.VIEW_INVOICES,
    Permission.VIEW_STATS,
    Permission.VIEW_PROLOCALISATION,
    Permission.MANAGE_PROLOCALISATION,
    Permission.VIEW_SPONSORISATION,
    Permission.MANAGE_SPONSORISATION,
    Permission.EXPORT_DATA,
    Permission.VIEW_USERS,
    Permission.MANAGE_USERS,
    Permission.ACCESS_ADMIN,
  ],
};

/**
 * Hook pour gérer les permissions utilisateur
 */
export function usePermissions() {
  const { user } = useAuth();

  const userRole = user?.role || 'VISITEUR';

  /**
   * Liste des permissions de l'utilisateur actuel
   */
  const permissions = useMemo(() => {
    return ROLE_PERMISSIONS[userRole] || [];
  }, [userRole]);

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  const hasPermission = (permission: PermissionType): boolean => {
    return permissions.includes(permission);
  };

  /**
   * Vérifie si l'utilisateur a au moins une des permissions données
   */
  const hasAnyPermission = (...perms: PermissionType[]): boolean => {
    return perms.some((perm) => hasPermission(perm));
  };

  /**
   * Vérifie si l'utilisateur a toutes les permissions données
   */
  const hasAllPermissions = (...perms: PermissionType[]): boolean => {
    return perms.every((perm) => hasPermission(perm));
  };

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  /**
   * Vérifie si l'utilisateur a au moins un des rôles donnés
   */
  const hasAnyRole = (...roles: UserRole[]): boolean => {
    return roles.includes(userRole);
  };

  /**
   * Vérifie si l'utilisateur est un visiteur (non authentifié ou rôle VISITEUR)
   */
  const isVisitor = useMemo(() => {
    return !user || userRole === 'VISITEUR';
  }, [user, userRole]);

  /**
   * Vérifie si l'utilisateur est un client
   */
  const isClient = useMemo(() => {
    return hasRole('CLIENT');
  }, [userRole]);

  /**
   * Vérifie si l'utilisateur est un manager
   */
  const isManager = useMemo(() => {
    return hasRole('MANAGER');
  }, [userRole]);

  /**
   * Vérifie si l'utilisateur est un admin
   */
  const isAdmin = useMemo(() => {
    return hasRole('ADMIN');
  }, [userRole]);

  /**
   * Vérifie si l'utilisateur peut créer des entreprises
   */
  const canCreateEntreprise = useMemo(() => {
    return hasPermission(Permission.CREATE_ENTREPRISE);
  }, [permissions]);

  /**
   * Vérifie si l'utilisateur peut modifier des entreprises
   */
  const canUpdateEntreprise = useMemo(() => {
    return hasPermission(Permission.UPDATE_ENTREPRISE);
  }, [permissions]);

  /**
   * Vérifie si l'utilisateur peut supprimer des entreprises
   */
  const canDeleteEntreprise = useMemo(() => {
    return hasPermission(Permission.DELETE_ENTREPRISE);
  }, [permissions]);

  /**
   * Vérifie si l'utilisateur peut uploader des avis
   */
  const canUploadAvis = useMemo(() => {
    return hasPermission(Permission.UPLOAD_AVIS);
  }, [permissions]);

  /**
   * Vérifie si l'utilisateur peut voir les statistiques
   */
  const canViewStats = useMemo(() => {
    return hasPermission(Permission.VIEW_STATS);
  }, [permissions]);

  /**
   * Vérifie si l'utilisateur peut exporter des données
   */
  const canExportData = useMemo(() => {
    return hasPermission(Permission.EXPORT_DATA);
  }, [permissions]);

  /**
   * Vérifie si l'utilisateur peut accéder à l'admin
   */
  const canAccessAdmin = useMemo(() => {
    return hasPermission(Permission.ACCESS_ADMIN);
  }, [permissions]);

  return {
    userRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isVisitor,
    isClient,
    isManager,
    isAdmin,
    canCreateEntreprise,
    canUpdateEntreprise,
    canDeleteEntreprise,
    canUploadAvis,
    canViewStats,
    canExportData,
    canAccessAdmin,
  };
}

/**
 * HOC pour protéger un composant avec une permission
 * @param Component - Le composant à protéger
 * @param requiredPermission - La permission requise
 * @param fallback - Composant à afficher si l'utilisateur n'a pas la permission
 */
export function withPermission<P extends object>(
  Component: ComponentType<P>,
  requiredPermission: PermissionType,
  fallback?: ComponentType<P>
) {
  return function PermissionGuard(props: P) {
    const { hasPermission } = usePermissions();

    if (!hasPermission(requiredPermission)) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent {...props} />;
      }
      return null;
    }

    return <Component {...props} />;
  };
}

/**
 * HOC pour protéger un composant avec un rôle
 * @param Component - Le composant à protéger
 * @param requiredRole - Le rôle requis ou les rôles requis
 * @param fallback - Composant à afficher si l'utilisateur n'a pas le rôle
 */
export function withRole<P extends object>(
  Component: ComponentType<P>,
  requiredRole: UserRole | UserRole[],
  fallback?: ComponentType<P>
) {
  return function RoleGuard(props: P) {
    const { hasRole, hasAnyRole } = usePermissions();

    const hasRequiredRole = Array.isArray(requiredRole)
      ? hasAnyRole(...requiredRole)
      : hasRole(requiredRole);

    if (!hasRequiredRole) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent {...props} />;
      }
      return null;
    }

    return <Component {...props} />;
  };
}
