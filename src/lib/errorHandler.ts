/**
 * Utilitaires pour gérer les erreurs API de manière cohérente
 */

import type { ApiError } from '../types/common';

/**
 * Formate un message d'erreur API de manière lisible
 */
export function formatApiError(error: unknown): string {
  // Si c'est une erreur API structurée
  if (isApiError(error)) {
    if (error.field_errors && typeof error.field_errors === 'object' && Object.keys(error.field_errors).length > 0) {
      return formatValidationErrors(error.field_errors as Record<string, string[]>);
    }
    if (error.detail) {
      return error.detail;
    }
    if (error.message) {
      return error.message;
    }
  }

  // Si c'est une erreur standard JavaScript
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback
  return 'Une erreur inattendue est survenue';
}

/**
 * Vérifie si l'erreur est une ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('detail' in error || 'message' in error || 'field_errors' in error)
  );
}

/**
 * Formate les erreurs de validation de champs
 */
export function formatValidationErrors(
  fieldErrors: Record<string, string[]>
): string {
  const messages: string[] = [];

  for (const [field, errors] of Object.entries(fieldErrors)) {
    const fieldName = formatFieldName(field);
    messages.push(`${fieldName}: ${errors.join(', ')}`);
  }

  return messages.join('\n');
}

/**
 * Formate le nom d'un champ pour l'affichage
 */
function formatFieldName(field: string): string {
  // Map des noms de champs techniques vers des noms lisibles
  const fieldNameMap: Record<string, string> = {
    email: 'Email',
    password: 'Mot de passe',
    password1: 'Mot de passe',
    password2: 'Confirmation du mot de passe',
    first_name: 'Prénom',
    last_name: 'Nom',
    nom: 'Nom',
    adresse: 'Adresse',
    code_postal: 'Code postal',
    ville: 'Ville',
    telephone: 'Téléphone',
    siret: 'SIRET',
    sous_categorie: 'Sous-catégorie',
    categorie: 'Catégorie',
    description: 'Description',
    website: 'Site web',
    note: 'Note',
    commentaire: 'Commentaire',
  };

  return fieldNameMap[field] || field.charAt(0).toUpperCase() + field.slice(1);
}

/**
 * Extrait le code de statut HTTP d'une erreur
 */
export function getErrorStatus(error: unknown): number | null {
  if (isApiError(error) && typeof error.status_code === 'number') {
    return error.status_code;
  }
  return null;
}

/**
 * Vérifie si une erreur est une erreur d'authentification (401)
 */
export function isAuthError(error: unknown): boolean {
  return getErrorStatus(error) === 401;
}

/**
 * Vérifie si une erreur est une erreur de permission (403)
 */
export function isPermissionError(error: unknown): boolean {
  return getErrorStatus(error) === 403;
}

/**
 * Vérifie si une erreur est une erreur de validation (400)
 */
export function isValidationError(error: unknown): boolean {
  return getErrorStatus(error) === 400;
}

/**
 * Vérifie si une erreur est une erreur "non trouvé" (404)
 */
export function isNotFoundError(error: unknown): boolean {
  return getErrorStatus(error) === 404;
}

/**
 * Crée un objet ApiError à partir d'une erreur quelconque
 */
export function createApiError(
  error: unknown,
  defaultMessage: string = 'Une erreur est survenue'
): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      detail: error.message,
    };
  }

  return {
    message: defaultMessage,
    detail: defaultMessage,
  };
}

/**
 * Extrait les erreurs de validation d'une erreur API
 */
export function getValidationErrors(
  error: unknown
): Record<string, string[]> | null {
  if (isApiError(error) && error.field_errors && typeof error.field_errors === 'object') {
    return error.field_errors as Record<string, string[]>;
  }
  return null;
}

/**
 * Obtient le premier message d'erreur pour un champ spécifique
 */
export function getFieldError(
  error: unknown,
  fieldName: string
): string | null {
  const validationErrors = getValidationErrors(error);
  if (validationErrors && validationErrors[fieldName]) {
    return validationErrors[fieldName][0];
  }
  return null;
}
