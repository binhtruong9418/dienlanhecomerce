import { useState, useEffect, useCallback } from 'react';
import productApi from '../api/productApi';
import { Product, ProductFilters, ProductsResponse } from '../types/product';

export const useProducts = (initialFilters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.getProducts({
        ...filters,
        page,
        limit: 12
      });
      
      console.log('Products response:', response);
      
      if (response && response.products) {
        setProducts(response.products);
        setTotal(response.total || 0);
        setTotalPages(response.totalPages || 1);
      } else {
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setError('Không thể tải danh sách sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setPage(1);
  };

  return {
    products,
    loading,
    error,
    total,
    page,
    totalPages,
    filters,
    updateFilters,
    resetFilters,
    setPage,
    refetch: fetchProducts,
  };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await productApi.getProductById(id);
        console.log('Product detail response:', response);
        
        if (response) {
          setProduct(response);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Fetch product error:', err);
        setError('Không thể tải thông tin sản phẩm');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export const useFeaturedProducts = (limit: number = 6) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const response = await productApi.getFeaturedProducts(limit);
        console.log('Featured products response:', response);
        
        if (Array.isArray(response)) {
          setProducts(response);
        } else if (response && response.products) {
          setProducts(response.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Fetch featured products error:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { products, loading };
};