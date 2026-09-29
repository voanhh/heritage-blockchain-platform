// src/api/heritage-version.api.ts
import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/heritage';

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
};
