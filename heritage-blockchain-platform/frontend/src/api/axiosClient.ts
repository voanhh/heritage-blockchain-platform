import axios from 'axios';

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
  const token = localStorage.getItem('accessToken');
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
        const userId = localStorage.getItem('userId');
        if (!userId) {
          // Chỉ redirect nếu người dùng ĐANG KHÔNG Ở trang chủ (hoặc các trang public)
          const publicPaths = ['/'];
          const currentPath = window.location.pathname;

          if (!publicPaths.includes(currentPath)) {
            window.location.href = '/auth';
          }

          return Promise.reject(error);
        }


        refreshTokenPromise = axios.post(
          `${axiosClient.defaults.baseURL}/auth/refresh`,
          { userId: userId },
          { withCredentials: true }
        ).then(res => {
          const newAccessToken = res.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          return newAccessToken;
        }).catch(refreshError => {
          console.error("Refresh token failed", refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('userId');
          window.location.href = '/auth';
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
