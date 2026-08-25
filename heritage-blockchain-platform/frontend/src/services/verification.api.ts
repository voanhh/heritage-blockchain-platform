import { api } from './api';
import type { ApiResponse, Verification } from '../types/heritage';

export type VerificationPayload = {
  reviewerId?: string;
  notes?: string;
};

export const verificationApi = {
  list: () => api.get<ApiResponse<Verification[]>>('/verifications'),
  detail: (id: string) => api.get<ApiResponse<Verification>>(`/verifications/${id}`),
  listByHeritage: (heritageId: string) =>
    api.get<ApiResponse<Verification[]>>(`/verifications/heritage/${heritageId}`),
  startReview: (heritageId: string, payload: VerificationPayload) =>
    api.post<ApiResponse<Verification>>(`/verifications/${heritageId}/start-review`, payload),
  approve: (heritageId: string, payload: VerificationPayload) =>
    api.post<ApiResponse<Verification>>(`/verifications/${heritageId}/approve`, payload),
  reject: (heritageId: string, payload: VerificationPayload) =>
    api.post<ApiResponse<Verification>>(`/verifications/${heritageId}/reject`, payload)
};
