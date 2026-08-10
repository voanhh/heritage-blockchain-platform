import { api } from './api';

export const blockchainApi = {
  records: () => api.get('/blockchain-records')
};

