import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3636/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    //tự sinh một deviceId lưu ở localStorage và gửi lên header này
    'x-device-id': 'browser-default-device'
  }
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error => {
  return Promise.reject(error);
}));

let refreshTokenPromise: any = null;

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;


      if (!refreshTokenPromise) {


        refreshTokenPromise = axios.post(
          `${axiosClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        ).then(res => {
          const { accessToken, userData } = res.data;
          useAuthStore.getState().setAuth(userData, accessToken);
          return accessToken;
        }).catch(refreshError => {
          console.error("Refresh token failed", refreshError);
          useAuthStore.getState().clearAuth();

          const publicPaths = ['/', '/login', '/register'];
          if (!publicPaths.includes(window.location.pathname)) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }).finally(() => {
          refreshTokenPromise = null;
        });
      }

      try {
        const newAccessToken = await refreshTokenPromise;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
