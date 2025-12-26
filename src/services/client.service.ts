import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type {
  Dashboard,
  Entreprise,
  EntrepriseCreateData,
  EntrepriseUpdateData,
  AvisDecrypte,
  AvisFilters,
  UploadAvisRequest,
  UploadAvisResponse,
  Sponsorisation,
} from '../types/client';
import type { PaginatedResponse } from '../types/common';

/**
 * Classe d'erreur personnalisée pour les erreurs client
 */
export class ClientError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Service pour l'espace client
 * Gère le dashboard, les entreprises et les avis
 */
class ClientService {
  /**
   * Récupère les données du dashboard
   * @throws {ClientError} Si la requête échoue
   */
  async getDashboard(entrepriseId?: string | null): Promise<Dashboard> {
    try {
      type DashboardApiResponse = {
        entreprise: Partial<Entreprise> & {
          id: string;
          nom: string;
          siren: string;
          adresse: string;
          ville?: string;
          ville_nom?: string;
          code_postal?: string;
          telephone?: string;
          email?: string;
          email_contact?: string;
          site_web?: string;
          nom_commercial?: string;
        };
        subscription?: {
          is_sponsored?: boolean;
          status?: string;
          montant_mensuel?: number | null;
          date_debut?: string | null;
          date_fin?: string | null;
          // Compat ancien backend
          is_active?: boolean;
          statut_paiement?: unknown;
        } | null;
        stats?: {
          impressions?: number;
          impressions_totales?: number;
          clicks?: number;
          clicks_totaux?: number;
          ctr?: number;
          taux_clic?: number;
          rotation_position?: number;
        };
        avis_actuel?: Partial<AvisDecrypte> | null;
        avis_recents?: AvisDecrypte[];
        can_upgrade?: boolean;
      };

      const { data } = await apiClient.get<DashboardApiResponse>('dashboard/', {
        // Ancien backend: filtrage par entreprise_id. Nouveau backend: résout via token/email.
        params: entrepriseId ? { entreprise_id: entrepriseId } : undefined,
      });

      const stats = data.stats ?? {};

      const impressions = (stats.impressions_totales ?? stats.impressions ?? 0) as number;
      const clicks = (stats.clicks_totaux ?? stats.clicks ?? 0) as number;
      const tauxClic = (stats.taux_clic ?? stats.ctr ?? 0) as number;
      const rotationPosition = (stats.rotation_position ?? 0) as number;

      const avisRecents: AvisDecrypte[] =
        data.avis_recents ??
        (data.avis_actuel
          ? [
              {
                id: (data.avis_actuel.id as string) ?? 'unknown',
                entreprise: (data.avis_actuel.entreprise as string) ?? data.entreprise.id,
                entreprise_nom:
                  (data.avis_actuel.entreprise_nom as string) ?? data.entreprise.nom,
                pro_localisation: (data.avis_actuel.pro_localisation as string) ?? 'unknown',
                texte_brut: (data.avis_actuel.texte_brut as string) ?? '',
                texte_decrypte: (data.avis_actuel.texte_decrypte as string) ?? '',
                source: (data.avis_actuel.source as any) ?? 'unknown',
                date_generation: (data.avis_actuel.date_generation as string) ?? new Date().toISOString(),
                date_expiration: (data.avis_actuel.date_expiration as string) ?? undefined,
                needs_regeneration: (data.avis_actuel.needs_regeneration as boolean) ?? false,
                confidence_score: (data.avis_actuel.confidence_score as number) ?? 0,
                created_at: (data.avis_actuel.created_at as string) ?? new Date().toISOString(),
                updated_at: (data.avis_actuel.updated_at as string) ?? new Date().toISOString(),
              },
            ]
          : []);

      // Certains backends renvoient `subscription.status = "none"` quand il n'y a pas d'abonnement.
      const subscription = data.subscription ?? null;
      const subscriptionStatus = (subscription as any)?.status as string | undefined;
      const hasSubscription = !!subscription && subscriptionStatus !== 'none';

      const sponsorisation = hasSubscription
        ? {
            // Nouveau backend: `is_sponsored`. Ancien backend: `is_active`.
            is_active: (subscription?.is_sponsored ?? subscription?.is_active ?? false) as boolean,
            date_debut:
              (subscription?.date_debut as string | null) ?? new Date().toISOString(),
            date_fin:
              (subscription?.date_fin as string | null) ?? new Date().toISOString(),
            montant_mensuel: (subscription?.montant_mensuel ?? 0) as number,
            // Nouveau backend: `status` n'est pas forcément un statut Stripe. On garde une valeur compatible UI.
            statut_paiement:
              ((subscription as any)?.statut_paiement as any) ??
              ((subscription as any)?.status as any) ??
              'inactive',
          }
        : null;

      // Mapping entreprise: le dashboard renvoie parfois un objet minimal.
      const nowIso = new Date().toISOString();
      const entreprise: Entreprise = {
        id: data.entreprise.id as any,
        siren: data.entreprise.siren ?? '',
        siret: (data.entreprise as any).siret ?? '',
        nom: data.entreprise.nom ?? '',
        nom_commercial: data.entreprise.nom_commercial ?? undefined,
        adresse: data.entreprise.adresse ?? '',
        code_postal: (data.entreprise as any).code_postal ?? data.entreprise.code_postal ?? '',
        ville_nom: (data.entreprise as any).ville_nom ?? data.entreprise.ville ?? '',
        naf_code: (data.entreprise as any).naf_code ?? undefined,
        naf_libelle: (data.entreprise as any).naf_libelle ?? undefined,
        telephone: (data.entreprise.telephone ?? (data.entreprise as any).telephone) ?? undefined,
        email_contact:
          (data.entreprise as any).email_contact ?? (data.entreprise as any).email ?? undefined,
        site_web: data.entreprise.site_web ?? undefined,
        is_active: (data.entreprise as any).is_active ?? true,
        nb_pro_localisations: (data.entreprise as any).nb_pro_localisations ?? undefined,
        created_at: (data.entreprise as any).created_at ?? nowIso,
        updated_at: (data.entreprise as any).updated_at ?? nowIso,
      };

      return {
        entreprise,
        sponsorisation,
        statistiques: {
          impressions_totales: impressions,
          clicks_totaux: clicks,
          taux_clic: tauxClic,
          rotation_position: rotationPosition,
        },
        avis_recents: avisRecents,
        can_upgrade: data.can_upgrade,
      };
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger le tableau de bord');
    }
  }

  /**
   * Récupère les détails d'une entreprise
   * @throws {ClientError} Si l'entreprise n'existe pas
   */
  async getEntreprise(id: string): Promise<Entreprise> {
    try {
      const { data } = await apiClient.get<Entreprise>(`entreprises/${id}/`);
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les informations de l\'entreprise');
    }
  }

  /**
   * Met à jour les informations d'une entreprise (PATCH)
   * @throws {ClientError} Si la mise à jour échoue
   */
  async updateEntreprise(id: string, updateData: EntrepriseUpdateData): Promise<Entreprise> {
    try {
      // Validation des données
      if (updateData.email_contact && !this.isValidEmail(updateData.email_contact)) {
        throw new ClientError('L\'adresse email est invalide', 400);
      }

      if (updateData.site_web && !this.isValidUrl(updateData.site_web)) {
        throw new ClientError('L\'URL du site web est invalide', 400);
      }

      const { data } = await apiClient.patch<Entreprise>(`entreprises/${id}/`, updateData);
      return data;
    } catch (error) {
      if (error instanceof ClientError) throw error;
      throw this.handleError(error, 'Impossible de mettre à jour l\'entreprise');
    }
  }

  /**
   * Crée une nouvelle entreprise
   * @throws {ClientError} Si la création échoue
   */
  async createEntreprise(createData: EntrepriseCreateData): Promise<Entreprise> {
    try {
      // Validation des données
      if (!createData.siren || createData.siren.length !== 9) {
        throw new ClientError('Le SIREN doit contenir 9 chiffres', 400);
      }

      if (createData.email_contact && !this.isValidEmail(createData.email_contact)) {
        throw new ClientError('L\'adresse email est invalide', 400);
      }

      if (createData.site_web && !this.isValidUrl(createData.site_web)) {
        throw new ClientError('L\'URL du site web est invalide', 400);
      }

      const { data } = await apiClient.post<Entreprise>('entreprises/', createData);
      return data;
    } catch (error) {
      if (error instanceof ClientError) throw error;
      throw this.handleError(error, 'Impossible de créer l\'entreprise');
    }
  }

  /**
   * Met à jour complètement une entreprise (PUT)
   * @throws {ClientError} Si la mise à jour échoue
   */
  async replaceEntreprise(id: string, updateData: EntrepriseCreateData): Promise<Entreprise> {
    try {
      const { data } = await apiClient.put<Entreprise>(`entreprises/${id}/`, updateData);
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de remplacer l\'entreprise');
    }
  }

  /**
   * Supprime une entreprise
   * @throws {ClientError} Si la suppression échoue
   */
  async deleteEntreprise(id: string): Promise<void> {
    try {
      await apiClient.delete(`entreprises/${id}/`);
    } catch (error) {
      throw this.handleError(error, 'Impossible de supprimer l\'entreprise');
    }
  }

  /**
   * Upload un avis de remplacement
   * @throws {ClientError} Si l'upload échoue
   */
  async uploadAvis(entrepriseId: string, avisData: UploadAvisRequest): Promise<UploadAvisResponse> {
    try {
      // Validation du texte
      if (!avisData.texte_avis || avisData.texte_avis.trim().length < 50) {
        throw new ClientError('L\'avis doit contenir au moins 50 caractères', 400);
      }

      const { data } = await apiClient.post<UploadAvisResponse>(
        `entreprises/${entrepriseId}/upload_avis/`,
        avisData
      );
      return data;
    } catch (error) {
      if (error instanceof ClientError) throw error;
      throw this.handleError(error, 'Impossible d\'envoyer l\'avis');
    }
  }

  /**
   * Récupère la liste des avis avec filtres
   * @throws {ClientError} Si la requête échoue
   */
  async getAvisDecryptes(filters: AvisFilters = {}): Promise<PaginatedResponse<AvisDecrypte>> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<AvisDecrypte>>(
        'avis-decryptes/',
        { params: filters }
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les avis');
    }
  }

  /**
   * Récupère les détails d'un avis
   * @throws {ClientError} Si l'avis n'existe pas
   */
  async getAvisDecrypte(avisId: string): Promise<AvisDecrypte> {
    try {
      const { data } = await apiClient.get<AvisDecrypte>(`avis-decryptes/${avisId}/`);
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger l\'avis');
    }
  }

  /**
   * Récupère la liste des avis d'une entreprise (méthode simplifiée)
   * @deprecated Utiliser getAvisDecryptes avec filtres
   */
  async getAvis(entrepriseId: string, page: number = 1): Promise<{ results: AvisDecrypte[]; count: number; next: string | null }> {
    try {
      const { data } = await apiClient.get<{ results: AvisDecrypte[]; count: number; next: string | null }>(
        'avis-decryptes/',
        {
          params: { entreprise: entrepriseId, page, page_size: 10 },
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les avis');
    }
  }

  /**
   * Récupère les détails d'un avis (méthode simplifiée)
   * @deprecated Utiliser getAvisDecrypte
   */
  async getAvisDetail(avisId: string): Promise<AvisDecrypte> {
    return this.getAvisDecrypte(avisId);
  }

  /**
   * Récupère les sponsorisations actives
   * @throws {ClientError} Si la requête échoue
   */
  async getSponsorisations(isActive?: boolean): Promise<Sponsorisation[]> {
    try {
      const { data } = await apiClient.get<{ results: Sponsorisation[] }>('sponsorisations/', {
        params: { is_active: isActive },
      });
      return data.results;
    } catch (error) {
      throw this.handleError(error, 'Impossible de charger les sponsorisations');
    }
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: unknown, defaultMessage: string): ClientError {
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

      return new ClientError(
        errorMessage,
        axiosError.response?.status,
        axiosError.response?.data as Record<string, string[]>
      );
    }

    if (error instanceof ClientError) {
      return error;
    }

    return new ClientError(defaultMessage);
  }

  /**
   * Validation d'email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validation d'URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export const clientService = new ClientService();
