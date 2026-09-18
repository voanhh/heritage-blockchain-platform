
import { HeritageMediaItem } from "../types/heritage";
import axiosClient from "./axiosClient";

export const mediaApi = {
  upload: async (file: File, type?: string, caption?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    if (caption) formData.append('caption', caption);

    const response = await axiosClient.post<{ data: HeritageMediaItem }>(
      '/upload/heritage-media',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },
};
