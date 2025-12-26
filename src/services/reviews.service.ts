import { apiClient } from '../api/search';
import type {
  GenerateFromIngestedRequest,
  GenerateFromIngestedResponse,
  GetIngestedDocumentRequest,
  IngestDocumentRequest,
  ListIngestedDocumentsRequest,
  ReviewAgentPayload,
} from '../types/reviews';

/**
 * Service Reviews (proxy Django).
 * IMPORTANT: le frontend ne gère pas de clé "agent" (pas de VITE api key).
 * Le backend Django se charge de la sécurité et de l'intégration.
 */
class ReviewsService {
  /**
   * POST /api/v1/reviews/ingest-document (multipart/form-data)
   */
  async ingestDocument(request: IngestDocumentRequest): Promise<ReviewAgentPayload> {
    const formData = new FormData();
    formData.append('company_id', request.company_id);
    if (request.company_name) formData.append('company_name', request.company_name);
    formData.append('file', request.file);

    try {
      const { data } = await apiClient.post<ReviewAgentPayload>(
        'v1/reviews/ingest-document',
        formData,
        {
          headers: {
            // Laisser Axios définir la boundary
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return data;
    } catch (e) {
      throw new Error('Impossible d\'ingérer le document');
    }
  }

  /**
   * GET /api/v1/reviews/ingested-documents?company_id=...&limit=...
   */
  async listIngestedDocuments(request: ListIngestedDocumentsRequest): Promise<ReviewAgentPayload> {
    try {
      const { data } = await apiClient.get<ReviewAgentPayload>('v1/reviews/ingested-documents', {
        params: {
          company_id: request.company_id,
          limit: request.limit,
        },
      });
      return data;
    } catch (e) {
      throw new Error('Impossible de récupérer les documents ingérés');
    }
  }

  /**
   * GET /api/v1/reviews/ingested-documents/{document_id}?company_id=...
   */
  async getIngestedDocument(request: GetIngestedDocumentRequest): Promise<ReviewAgentPayload> {
    try {
      const { data } = await apiClient.get<ReviewAgentPayload>(
        `v1/reviews/ingested-documents/${request.document_id}`,
        {
          params: request.company_id ? { company_id: request.company_id } : undefined,
        }
      );
      return data;
    } catch (e) {
      throw new Error('Impossible de récupérer le document');
    }
  }

  /**
   * POST /api/v1/reviews/generate-from-ingested
   */
  async generateFromIngested(
    request: GenerateFromIngestedRequest
  ): Promise<GenerateFromIngestedResponse> {
    const payload: Record<string, unknown> = {
      pro_localisation_id: request.pro_localisation_id,
    };
    if (typeof request.force !== 'undefined') payload.force = request.force;

    try {
      const { data } = await apiClient.post<GenerateFromIngestedResponse>(
        'v1/reviews/generate-from-ingested',
        payload
      );
      return data;
    } catch (e) {
      throw new Error('Impossible de générer un avis IA');
    }
  }
}

export const reviewsService = new ReviewsService();
