import { api } from './api';

export const heritageApi = {
  list: () => api.get('/heritages'),
  detail: (id: string) => api.get(`/heritages/${id}`)
};

