import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  withCredentials: true,
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if(error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post('/api/refresh-token');

        const newAccessToken = response.data.newAccessToken;

        return axiosInstance(originalRequest);
      } catch (refreshError){
          console.error('Refresh token is invalid', refreshError);
          return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
)

export default axiosInstance;