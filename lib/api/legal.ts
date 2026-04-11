import { apiClient } from "./client";

export interface LegalDocumentResponse {
  version: string;
  effectiveDate: string;
  content: string;
}

export function fetchTerms(): Promise<LegalDocumentResponse> {
  return apiClient<LegalDocumentResponse>("/hammers/hammer-users/legal/terms");
}

export function fetchPrivacyPolicy(): Promise<LegalDocumentResponse> {
  return apiClient<LegalDocumentResponse>(
    "/hammers/hammer-users/legal/privacy",
  );
}
