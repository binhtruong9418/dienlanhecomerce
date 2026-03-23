import axiosClient from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalQuotes: {
    all: number;
    pending: number;
    quoted: number;
    completed: number;
  };
  recentQuotes: Array<{
    id: string;
    customerName: string;
    product: string;
    quantity: number;
    status: string;
    createdAt: string;
  }>;
  popularProducts: Array<{
    id: string;
    name: string;
    views: number;
    quoteRequests: number;
  }>;
}

const adminApi = {
  // Đăng nhập
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      console.log('Login response:', response);
      return response as LoginResponse;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    return axiosClient.post('/auth/logout');
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<LoginResponse['user']> => {
    const response = await axiosClient.get('/auth/me');
    console.log('Get current user response:', response);
    return response.user;
  },

  // Lấy thống kê dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get('/admin/stats');
    console.log('Dashboard stats response:', response);
    return response.stats;
  },

  // Upload file
  uploadFile: async (file: File, folder: string): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const response = await axiosClient.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },

  // Upload nhiều file
  uploadMultipleFiles: async (files: File[], folder: string): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('folder', folder);
    const response = await axiosClient.post('/admin/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },
};

export default adminApi;