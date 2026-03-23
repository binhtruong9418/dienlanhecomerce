import { useState, useEffect, useCallback } from 'react';
import quoteApi from '../api/quoteApi';
import { QuoteRequest, QuoteRequestFilters } from '../types/quote';

export const useQuoteRequests = (initialFilters?: QuoteRequestFilters) => {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<QuoteRequestFilters>(initialFilters || {});

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await quoteApi.getQuoteRequests({
        ...filters,
        page,
      });
      
      console.log('Quote requests response:', response);
      
      if (response && response.requests) {
        setRequests(response.requests);
        setTotal(response.total || response.requests.length);
        setTotalPages(response.totalPages || 1);
      } else if (Array.isArray(response)) {
        setRequests(response);
        setTotal(response.length);
        setTotalPages(1);
      } else {
        setRequests([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Fetch quote requests error:', err);
      setError('Không thể tải danh sách yêu cầu');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateFilters = (newFilters: Partial<QuoteRequestFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setPage(1);
  };

  return {
    requests,
    loading,
    error,
    total,
    page,
    totalPages,
    filters,
    updateFilters,
    resetFilters,
    setPage,
    refetch: fetchRequests,
  };
};

export const useQuoteRequest = (id: string) => {
  const [request, setRequest] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await quoteApi.getQuoteRequestById(id);
        console.log('Quote request detail response:', response);
        
        if (response && response.quote) {
          setRequest(response.quote);
        } else if (response) {
          setRequest(response);
        } else {
          setRequest(null);
        }
      } catch (err) {
        console.error('Fetch quote request error:', err);
        setError('Không thể tải thông tin yêu cầu');
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  return { request, loading, error };
};

export const useUpdateQuoteStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string, quotedPrice?: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await quoteApi.updateQuoteStatus(id, status, quotedPrice);
      return response;
    } catch (err) {
      console.error('Update quote status error:', err);
      setError('Không thể cập nhật trạng thái');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
};

export const useAddQuoteNote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNote = async (id: string, note: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await quoteApi.addQuoteNote(id, note);
      return response;
    } catch (err) {
      console.error('Add quote note error:', err);
      setError('Không thể thêm ghi chú');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addNote, loading, error };
};