import { useState, useEffect } from 'react';
import categoryApi from '../api/categoryApi';
import { Category } from '../types/category';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await categoryApi.getCategories();
        setCategories(data);
      } catch (err) {
        setError('Không thể tải danh mục');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useCategory = (slug: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const data = await categoryApi.getCategoryBySlug(slug);
        setCategory(data);
      } catch (err) {
        setError('Không thể tải thông tin danh mục');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, loading, error };
};