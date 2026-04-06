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

export interface TimeseriesEntry {
  date: string; // "2026-04-01"
  quoteCount: number;
  quotedCount: number;
}

export interface TimeseriesResponse {
  timeseries: TimeseriesEntry[];
  uniqueCustomers: number;
}

export interface Ga4Stats {
  available: boolean;
  sessionsToday?: number;
  pageviewsToday?: number;
  totalSessions7d?: number;
  totalPageviews7d?: number;
  totalUsers7d?: number;
  newUsers7d?: number;
  dailySessions?: { date: string; sessions: number; pageviews: number }[];
  topPages?: { path: string; views: number }[];
  trafficSources?: { channel: string; sessions: number }[];
  deviceBreakdown?: { device: string; sessions: number }[];
  topProductPages?: { path: string; name: string; views: number }[];
  error?: string;
  serviceAccountEmail?: string;
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
    _id: string;
    name: string;
    views: number;
  }>;
}

const adminApi = {
  // Đăng nhập
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      return response as LoginResponse;
    } catch (error) {
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
    return response.user;
  },

  // Lấy thống kê dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get('/admin/stats');
    return response.stats;
  },

  // Lấy thống kê theo ngày (timeseries)
  getTimeseries: async (): Promise<TimeseriesResponse> => {
    const response = await axiosClient.get('/admin/stats/timeseries');
    return response as TimeseriesResponse;
  },

  // Lấy thống kê GA4
  getGa4Stats: async (): Promise<{ ga4: Ga4Stats }> => {
    const response = await axiosClient.get('/admin/stats/ga4');
    return response as { ga4: Ga4Stats };
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