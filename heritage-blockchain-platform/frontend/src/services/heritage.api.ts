import { api } from './api';
import type { ApiResponse, Heritage, HeritagePayload, HeritageStatus } from '../types/heritage';

export const heritageApi = {
  list: (params?: { status?: HeritageStatus | 'ALL'; search?: string }) =>
    api.get<ApiResponse<Heritage[]>>('/heritages', {
      params: {
        status: params?.status === 'ALL' ? undefined : params?.status,
        search: params?.search || undefined
      }
    }),
  detail: (id: string) => api.get<ApiResponse<Heritage>>(`/heritages/${id}`),
  create: (payload: HeritagePayload) => api.post<ApiResponse<Heritage>>('/heritages', payload),
  update: (id: string, payload: Partial<HeritagePayload> & { status?: HeritageStatus }) =>
    api.put<ApiResponse<Heritage>>(`/heritages/${id}`, payload),
  submit: (id: string) => api.patch<ApiResponse<Heritage>>(`/heritages/${id}/submit`),
  updateStatus: (id: string, status: HeritageStatus) =>
    api.patch<ApiResponse<Heritage>>(`/heritages/${id}/status`, { status }),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/heritages/${id}`)
};
