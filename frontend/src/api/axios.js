import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  withCredentials: true,  // クッキーを送信するため
});

axiosInstance.interceptors.response.use(
  (response) => response,  // 正常なレスポンスはそのまま返す
  async (error) => {
    const originalRequest = error.config;

    // JWTトークンが期限切れで401エラーが発生した場合
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Sending refresh token request...');
        const refreshResponse = await axios.post('/api/refresh-token', {}, { withCredentials: true });

        console.log('Refresh token response received:', refreshResponse.data);
        const newAccessToken = refreshResponse.data.newAccessToken;

        if (!newAccessToken) {
          localStorage.remove('authUser');
          window.location.href = '/login';
          throw new Error('New access token is undefined');
        }

        console.log('New access token:', newAccessToken);
        axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + newAccessToken;

        console.log('Retrying original request with new access token...');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError.response?.data || refreshError.message);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
