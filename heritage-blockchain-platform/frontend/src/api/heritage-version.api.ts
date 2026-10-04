// src/api/heritage-version.api.ts
import axiosClient from './axiosClient';
import type { ApiResponse, HeritageVersionItem } from '../types/heritage';

export interface HeritageVersion {
  id: string;
  heritageId: string;
  versionNumber: number;
  dataHash: string;
  txHash?: string;
  blockNumber?: number;
  createdById: string;
}

export const heritageVersionApi = {
  publish: (heritageId: string) =>
    axiosClient.post<{ success: boolean, data: HeritageVersion }>(`/version/${heritageId}/publish`),

  // 1. Lấy danh sách (Có tìm kiếm theo Name & Location)
  getVersions: async (params?: { search?: string; location?: string }): Promise<ApiResponse<HeritageVersionItem[]>> => {
    const response = await axiosClient.get('/version', { params });
    return response.data;
  },

  // 2. Lấy chi tiết phiên bản di sản theo ID
  getVersionById: async (id: string): Promise<ApiResponse<HeritageVersionItem>> => {
    const response = await axiosClient.get(`/version/${id}`);
    return response.data;
  },
};
