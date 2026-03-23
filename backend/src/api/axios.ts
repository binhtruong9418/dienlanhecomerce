import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API Base URL:', BASE_URL);

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request:', {
      url: config.url,
      method: config.method,
      token: token ? 'exists' : 'none',
      data: config.data
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
axiosClient.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.data);
    // API trả về { success: true, token, user }
    return response.data;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;