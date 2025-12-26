export type UUID = string;

export type ReviewAgentPayload = Record<string, unknown>;

export interface IngestDocumentRequest {
  company_id: UUID;
  company_name?: string;
  file: File;
}

export interface ListIngestedDocumentsRequest {
  company_id: UUID;
  limit?: number;
}

export interface GetIngestedDocumentRequest {
  document_id: number;
  company_id?: UUID;
}

export interface GenerateFromIngestedRequest {
  pro_localisation_id: UUID;
  force?: boolean;
}

export interface GenerateFromIngestedResponse {
  success: boolean;
  pro_localisation_id: UUID;
  company_id: UUID;
  text: string;
  error_details: unknown;
}
