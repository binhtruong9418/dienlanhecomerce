// api/quoteApi.ts
import axiosClient from './axios';
import { QuoteRequest, QuoteRequestFilters, QuoteRequestsResponse } from '../types/quote';

const quoteApi = {
  // Gửi yêu cầu báo giá
  submitQuoteRequest: async (data: FormData): Promise<QuoteRequest> => {
    try {
      console.log('Sending quote request to /quotes');
      const response = await axiosClient.post('/quotes', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Submit quote response:', response);
      
      // API trả về { success: true, quote: {...} }
      if (response && response.quote) {
        return response.quote;
      }
      return response as QuoteRequest;
    } catch (error) {
      console.error('Error submitting quote:', error);
      throw error;
    }
  },

  // Admin: Lấy tất cả yêu cầu
  getQuoteRequests: async (filters?: QuoteRequestFilters): Promise<QuoteRequestsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    console.log('Fetching quote requests with params:', params.toString());
    
    const response = await axiosClient.get(`/quotes?${params.toString()}`);
    console.log('Get quote requests response:', response);
    
    // API trả về { success: true, requests: [...] }
    if (response && response.requests) {
      return {
        success: true,
        requests: response.requests,
        total: response.total || response.requests.length,
        page: response.page || 1,
        totalPages: response.totalPages || 1
      };
    }
    return { success: true, requests: [], total: 0, page: 1, totalPages: 1 };
  },

  // Admin: Lấy yêu cầu theo ID
  getQuoteRequestById: async (id: string): Promise<QuoteRequest> => {
    const response = await axiosClient.get(`/quotes/${id}`);
    return response.quote || response;
  },

  // Admin: Cập nhật trạng thái
  updateQuoteStatus: async (id: string, status: string, quotedPrice?: number): Promise<QuoteRequest> => {
    const response = await axiosClient.patch(`/quotes/${id}/status`, { status, quotedPrice });
    return response.quote || response;
  },

  // Admin: Thêm ghi chú
  addQuoteNote: async (id: string, note: string): Promise<QuoteRequest> => {
    const response = await axiosClient.post(`/quotes/${id}/notes`, { note });
    return response.quote || response;
  },

  // Admin: Xóa yêu cầu
  deleteQuoteRequest: async (id: string): Promise<void> => {
    return axiosClient.delete(`/quotes/${id}`);
  },
};

export default quoteApi;