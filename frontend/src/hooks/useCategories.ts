import { useQuery } from '@tanstack/react-query';
import categoryApi from '../api/categoryApi';
import { Category } from '../types/category';

export const useCategories = () => {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  return { 
    categories: (Array.isArray(data) ? data : data?.categories || []) as Category[], 
    loading, 
    error: error ? 'Không thể tải danh mục' : null 
  };
};

export const useCategory = (slug: string) => {
  const { data: category, isLoading: loading, error } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryApi.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  return { 
    category, 
    loading, 
    error: error ? 'Không thể tải thông tin danh mục' : null 
  };
};