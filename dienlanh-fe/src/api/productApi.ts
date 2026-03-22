import axiosClient from './axios';
import { Product, ProductFilters, ProductsResponse } from '../types/product';

const productApi = {
  // Lấy danh sách sản phẩm với filter
  getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    try {
      const response = await axiosClient.get(`/products?${params.toString()}`);
      console.log('getProducts response:', response);
      return response as ProductsResponse;
    } catch (error) {
      console.error('getProducts error:', error);
      return { products: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  // Lấy sản phẩm theo slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    try {
      const response = await axiosClient.get(`/products/${slug}`);
      console.log('getProductBySlug response:', response);
      
      // API trả về { success: true, product: {...} }
      if (response && response.product) {
        return response.product;
      }
      return response as Product;
    } catch (error) {
      console.error('getProductBySlug error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await axiosClient.get(`/products/id/${id}`);
      return response.product || response;
    } catch (error) {
      console.error('getProductById error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts: async (limit: number = 6): Promise<Product[]> => {
    try {
      const response = await axiosClient.get(`/products/featured?limit=${limit}`);
      console.log('getFeaturedProducts response:', response);
      
      if (response && response.products) {
        return response.products;
      }
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('getFeaturedProducts error:', error);
      return [];
    }
  },

  // Lấy sản phẩm liên quan
  getRelatedProducts: async (productId: string, limit: number = 4): Promise<Product[]> => {
    try {
      const response = await axiosClient.get(`/products/${productId}/related?limit=${limit}`);
      return response.products || response || [];
    } catch (error) {
      console.error('getRelatedProducts error:', error);
      return [];
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (keyword: string, limit?: number): Promise<Product[]> => {
    try {
      const response = await axiosClient.get(`/products/search?q=${keyword}${limit ? `&limit=${limit}` : ''}`);
      return response.products || response || [];
    } catch (error) {
      console.error('searchProducts error:', error);
      return [];
    }
  },

  // Admin: Tạo sản phẩm mới
  createProduct: async (data: Partial<Product>): Promise<Product> => {
    try {
      const response = await axiosClient.post('/products', data);
      return response.product || response;
    } catch (error) {
      console.error('createProduct error:', error);
      throw error;
    }
  },

  // Admin: Cập nhật sản phẩm
  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    try {
      const response = await axiosClient.put(`/products/${id}`, data);
      return response.product || response;
    } catch (error) {
      console.error('updateProduct error:', error);
      throw error;
    }
  },

  // Admin: Xóa sản phẩm
  deleteProduct: async (id: string): Promise<void> => {
    try {
      return await axiosClient.delete(`/products/${id}`);
    } catch (error) {
      console.error('deleteProduct error:', error);
      throw error;
    }
  },

  // Admin: Cập nhật trạng thái
  updateProductStatus: async (id: string, status: 'active' | 'inactive'): Promise<Product> => {
    try {
      const response = await axiosClient.patch(`/products/${id}/status`, { status });
      return response.product || response;
    } catch (error) {
      console.error('updateProductStatus error:', error);
      throw error;
    }
  },
};

export default productApi;