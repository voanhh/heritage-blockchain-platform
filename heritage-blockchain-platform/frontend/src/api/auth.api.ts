import axiosClient from '../api/axiosClient';

interface LoginPayload {
  email: string;
  passwordRaw: string;
}

interface RegisterPayload {
  email: string;
  passwordRaw: string;
  fullName: string;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const response = await axiosClient.post('/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    // Gọi đến endpoint register của Backend
    const response = await axiosClient.post('/auth/register', payload);
    return response.data;
  }
};
