// categoryApi.ts
import axiosClient from './axios';
import { Category } from '../types/category';

const categoryApi = {
  // Lấy tất cả danh mục
  getCategories: async (filters?: { status?: string }): Promise<any> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    const url = params.toString() ? `/categories?${params.toString()}` : '/categories';
    const response = await axiosClient.get(url);
    return response.categories || response;
  },

  // Lấy danh mục theo slug
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await axiosClient.get(`/categories/${slug}`);
    return response.category || response;
  },

  // Admin: Tạo danh mục mới
  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await axiosClient.post('/categories', data);
    return response.category; // Lấy category từ response
  },

  // Admin: Cập nhật danh mục
  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await axiosClient.put(`/categories/${id}`, data);
    return response.category; // Lấy category từ response
  },

  // Admin: Xóa danh mục
  deleteCategory: async (id: string): Promise<void> => {
    return axiosClient.delete(`/categories/${id}`);
  },

  // Admin: Cập nhật trạng thái
  updateCategoryStatus: async (id: string, status: string): Promise<Category> => {
    const response = await axiosClient.patch(`/categories/${id}/status`, { status });
    return response.category || response;
  },

  // Admin: Cập nhật thứ tự
  updateCategoryOrder: async (id: string, order: number): Promise<Category> => {
    const response = await axiosClient.patch(`/categories/${id}/order`, { order });
    return response.category || response;
  },
};

export default categoryApi;