import { api } from './api';

export const authApi = {
  health: () => api.get('/health')
};

