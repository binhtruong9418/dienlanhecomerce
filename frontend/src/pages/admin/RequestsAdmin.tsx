import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RequestsContent } from '../../components/RequestsContent';
import quoteApi from '../../api/quoteApi';
import { getStatusColor, getStatusLabel } from './utils';
import { QuoteRequest } from '../../types/quote';

export function RequestsAdmin() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'pending'|'quoted'|'completed'>('all');

  const { data: response, isLoading } = useQuery({
    queryKey: ['quoteRequests'],
    queryFn: () => quoteApi.getQuoteRequests({ limit: 1000 })
  });

  const quoteRequests = (response?.requests || []).map((req: QuoteRequest) => ({
    ...req,
    id: req._id,
    customerName: req.customerName || 'N/A',
    date: req.createdAt ? new Date(req.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
  }));

  const filteredQuoteRequests = quoteRequests.filter((req: QuoteRequest) => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesSearch = searchTerm === '' ||
      req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <RequestsContent
      quoteRequests={quoteRequests}
      searchTerm={searchTerm}
      statusFilter={statusFilter}
      filteredQuoteRequests={filteredQuoteRequests}
      onSearchChange={setSearchTerm}
      onStatusFilterChange={setStatusFilter}
      onViewDetail={(req) => navigate(`/admin/requests/${req._id}`)}
      getStatusColor={getStatusColor}
      getStatusLabel={getStatusLabel}
    />
  );
}
