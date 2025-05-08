import axios from 'axios';

// クッキーからXSRF-TOKENを取得する関数
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

const axiosInstance = axios.create({
  // baseURL: 'https://d39hmozy4wec8b.cloudfront.net',
  baseURL: 'http://127.0.0.1:8000',
  // baseURL: 'https://dsigners.site',
  timeout: 10000,
  withCredentials: true,  // クッキーを送信するため
});

axiosInstance.interceptors.request.use(
  (config) => {
    // XSRF-TOKENをクッキーから取得

    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      // ヘッダーにX-XSRF-TOKENを追加
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    console.log('Request Headers:', config.headers); 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
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
          localStorage.removeItem('authUser');
          window.location.href = '/login';
          throw new Error('New access token is undefined');
        }

        console.log('New access token:', newAccessToken);
        axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + newAccessToken;
        console.log(axiosInstance.defaults.headers['Authorization']);
        

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
