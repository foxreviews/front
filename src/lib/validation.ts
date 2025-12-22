/**
 * Schémas de validation Zod pour les formulaires et requêtes API
 */

import { z } from 'zod';

/**
 * Validation des emails
 */
const emailSchema = z
  .string()
  .min(1, 'L\'email est requis')
  .email('Format d\'email invalide');

/**
 * Validation des mots de passe
 */
const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

/**
 * Validation des numéros de téléphone français
 */
const phoneSchema = z
  .string()
  .regex(
    /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/,
    'Format de téléphone invalide (ex: 0612345678)'
  );

/**
 * Validation SIRET (14 chiffres)
 */
const siretSchema = z
  .string()
  .regex(/^[0-9]{14}$/, 'Le SIRET doit contenir 14 chiffres');

/**
 * Validation code postal français (5 chiffres)
 */
const codePostalSchema = z
  .string()
  .regex(/^[0-9]{5}$/, 'Le code postal doit contenir 5 chiffres');

/**
 * Validation URL
 */
const urlSchema = z.string().url('Format d\'URL invalide').optional().or(z.literal(''));

/**
 * Schéma de validation pour l'inscription (Register)
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password1: passwordSchema,
    password2: z.string().min(1, 'La confirmation du mot de passe est requise'),
    first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  })
  .refine((data) => data.password1 === data.password2, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password2'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Schéma de validation pour la connexion (Login)
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schéma de validation pour la réinitialisation de mot de passe
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export type PasswordResetRequestFormData = z.infer<
  typeof passwordResetRequestSchema
>;

/**
 * Schéma de validation pour la création d'entreprise
 */
export const createEntrepriseSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  adresse: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  code_postal: codePostalSchema,
  ville: z.string().min(1, 'La ville est requise'),
  telephone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  website: urlSchema,
  siret: siretSchema.optional().or(z.literal('')),
  sous_categorie: z.string().uuid('Sous-catégorie invalide'),
  description: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
  horaires: z.string().optional(),
});

export type CreateEntrepriseFormData = z.infer<typeof createEntrepriseSchema>;

/**
 * Schéma de validation pour la mise à jour d'entreprise (partiel)
 */
export const updateEntrepriseSchema = createEntrepriseSchema.partial();

export type UpdateEntrepriseFormData = z.infer<typeof updateEntrepriseSchema>;

/**
 * Schéma de validation pour l'upload d'avis
 */
export const uploadAvisSchema = z.object({
  entreprise_id: z.string().uuid('Entreprise invalide'),
  fichier: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'Le fichier ne doit pas dépasser 10 Mo',
    })
    .refine(
      (file) => {
        const validTypes = [
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        return validTypes.includes(file.type);
      },
      {
        message: 'Format de fichier invalide (CSV, XLS, XLSX acceptés)',
      }
    ),
});

export type UploadAvisFormData = z.infer<typeof uploadAvisSchema>;

/**
 * Schéma de validation pour la création de checkout Stripe
 */
export const createCheckoutSchema = z.object({
  forfait: z.enum(['basic', 'premium', 'enterprise'], {
    message: 'Forfait invalide',
  }),
  duree_mois: z
    .number()
    .int('La durée doit être un nombre entier')
    .min(1, 'La durée minimale est de 1 mois')
    .max(12, 'La durée maximale est de 12 mois'),
  success_url: urlSchema.refine((val) => val !== '', {
    message: 'L\'URL de succès est requise',
  }),
  cancel_url: urlSchema.refine((val) => val !== '', {
    message: 'L\'URL d\'annulation est requise',
  }),
});

export type CreateCheckoutFormData = z.infer<typeof createCheckoutSchema>;

/**
 * Schéma de validation pour la mise à jour de compte
 */
export const updateAccountSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  email: emailSchema.optional(),
  telephone: phoneSchema.optional().or(z.literal('')),
});

export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;

/**
 * Schéma de validation pour le changement de mot de passe
 */
export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Le mot de passe actuel est requis'),
    new_password1: passwordSchema,
    new_password2: z.string().min(1, 'La confirmation du mot de passe est requise'),
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['new_password2'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Schéma de validation pour les filtres de recherche
 */
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  ville: z.string().optional(),
  categorie: z.string().optional(),
  sous_categorie: z.string().optional(),
  page: z.number().int().min(1).optional(),
  page_size: z.number().int().min(1).max(100).optional(),
});

export type SearchFiltersFormData = z.infer<typeof searchFiltersSchema>;
