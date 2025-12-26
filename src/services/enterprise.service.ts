import axios, { AxiosError } from 'axios';
import { apiClient } from '../api/search';
import type {
  EnterpriseSearchParams,
  EnterpriseSearchResponse,
} from '../types/enterprise';

export class EnterpriseError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'EnterpriseError';
    this.statusCode = statusCode;
  }
}

class EnterpriseService {
  async search(params: EnterpriseSearchParams): Promise<EnterpriseSearchResponse> {
    if (!params.q || params.q.trim().length < 3) {
      return { results: [], count: 0 };
    }

    try {
      const { data } = await apiClient.get<EnterpriseSearchResponse>(
        'entreprises/search/',
        {
          params: {
            q: params.q.trim(),
            ...(params.code_postal ? { code_postal: params.code_postal.trim() } : {}),
          },
        }
      );

      return {
        results: data.results ?? [],
        count: data.count ?? (data.results?.length ?? 0),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail?: string; error?: string }>;
        const message =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          'Erreur lors de la recherche d\'entreprise';

        throw new EnterpriseError(message, axiosError.response?.status);
      }

      throw new EnterpriseError('Erreur réseau lors de la recherche d\'entreprise');
    }
  }
}

export const enterpriseService = new EnterpriseService();
