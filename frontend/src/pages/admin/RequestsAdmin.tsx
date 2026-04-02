import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RequestsContent } from '../../components/RequestsContent';
import quoteApi from '../../api/quoteApi';
import toast from 'react-hot-toast';
import { getStatusColor, getStatusLabel } from './utils';
import { QuoteRequest } from '../../types/quote';

export function RequestsAdmin() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'pending'|'quoted'|'completed'>('all');
  
  const [showRequestDetail, setShowRequestDetail] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [quotedPrice, setQuotedPrice] = useState('');

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

  const updateMutation = useMutation({
    mutationFn: ({ id, status, price }: { id: string; status: string; price?: number }) => quoteApi.updateQuoteStatus(id, status, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
      toast.success('Cập nhật trạng thái thành công');
      setShowRequestDetail(false);
    },
    onError: () => toast.error('Cập nhật thất bại')
  });

  const handleUpdate = (newStatus: string) => {
    if (!selectedRequest) return;
    updateMutation.mutate({ 
      id: selectedRequest._id, 
      status: newStatus, 
      price: newStatus === 'quoted' ? parseInt(quotedPrice) : undefined 
    });
  };

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
    <>
      <RequestsContent
        quoteRequests={quoteRequests}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        filteredQuoteRequests={filteredQuoteRequests}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onViewDetail={(req) => {
          setSelectedRequest(req);
          setQuotedPrice(req.quotedPrice?.toString() || '');
          setShowRequestDetail(true);
        }}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
      />
      {showRequestDetail && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
             <h3 className="text-xl font-bold mb-4">Chi tiết yêu cầu</h3>
             <div className="grid grid-cols-2 gap-4 mb-4">
               <div>Sản phẩm: {selectedRequest.product}</div>
               <div>Tên khách hàng: {selectedRequest.customerName}</div>
               <div>SĐT: {selectedRequest.phone}</div>
               <div>Trạng thái: {getStatusLabel(selectedRequest.status)}</div>
             </div>
             {selectedRequest.images?.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold mb-2">Ảnh đính kèm:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedRequest.images.map((img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
                        onClick={() => window.open(img, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}
             {selectedRequest.status === 'pending' && (
                <div className="space-y-4 mb-4">
                  <input type="number" value={quotedPrice} onChange={e => setQuotedPrice(e.target.value)} placeholder="Nhập giá báo (VNĐ)" className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
                  <div className="flex gap-3">
                     <button onClick={() => handleUpdate('quoted')} className="flex-1 bg-blue-600 text-white py-3 rounded-lg">Đã báo giá</button>
                     <button onClick={() => handleUpdate('completed')} className="flex-1 bg-green-600 text-white py-3 rounded-lg">Hoàn thành</button>
                  </div>
                </div>
             )}
             {selectedRequest.status === 'quoted' && (
                <button onClick={() => handleUpdate('completed')} className="w-full mb-4 bg-green-600 text-white py-3 rounded-lg">Đánh dấu hoàn thành</button>
             )}
             <button onClick={() => setShowRequestDetail(false)} className="w-full border-2 border-secondary-300 py-3 rounded-lg">Đóng</button>
          </div>
        </div>
      )}
    </>
  );
}
