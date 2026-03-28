import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import productApi from '../api/productApi';
import { Product, ProductFilters, ProductsResponse } from '../types/product';

export const useProducts = (initialFilters?: ProductFilters) => {
  const [page, setPage] = useState(initialFilters?.page || 1);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});

  const { data, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['products', { ...filters, page }],
    queryFn: () => productApi.getProducts({ ...filters, page, limit: 12 }),
    staleTime: 5 * 60 * 1000,
  });

  const response = data as ProductsResponse | undefined;

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters((prev: ProductFilters) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  return {
    products: response?.products || [],
    loading,
    error: error ? 'Không thể tải danh sách sản phẩm' : null,
    total: response?.total || 0,
    page: response?.page || 1,
    totalPages: response?.totalPages || 1,
    filters,
    updateFilters,
    resetFilters,
    setPage,
    refetch,
  };
};

export const useProduct = (idOrSlug: string) => {
  const { data: product, isLoading: loading, error } = useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: async () => {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
      return isObjectId ? productApi.getProductById(idOrSlug) : productApi.getProductBySlug(idOrSlug);
    },
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });

  return { 
    product, 
    loading, 
    error: error ? 'Không thể tải thông tin sản phẩm' : null 
  };
};

export const useFeaturedProducts = (limit: number = 6) => {
  const { data, isLoading: loading, error } = useQuery<any>({
    queryKey: ['featuredProducts', limit],
    queryFn: () => productApi.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000,
  });

  return { 
    products: (Array.isArray(data) ? data : data?.products || []) as Product[], 
    loading, 
    error: error ? 'Lỗi tải sản phẩm nổi bật' : null 
  };
};

export const useRelatedProducts = (productId: string, limit: number = 4) => {
  const { data, isLoading: loading, error } = useQuery<any>({
     queryKey: ['relatedProducts', productId, limit],
     queryFn: () => productApi.getRelatedProducts(productId, limit),
     enabled: !!productId,
     staleTime: 10 * 60 * 1000,
  });

  return {
    products: (Array.isArray(data) ? data : data?.products || []) as Product[],
    loading,
    error: error ? 'Lỗi tải sản phẩm liên quan' : null
  };
};