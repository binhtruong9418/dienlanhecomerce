// Admin request detail full page — replaces inline detail modal in RequestsAdmin
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import quoteApi from '../../api/quoteApi';
import { getStatusColor, getStatusLabel } from './utils';
import toast from 'react-hot-toast';

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quotedPrice, setQuotedPrice] = useState('');

  const { data: request, isLoading, isError } = useQuery({
    queryKey: ['quote-request', id],
    queryFn: () => quoteApi.getQuoteRequestById(id!),
    enabled: !!id,
  });

  // Pre-fill quoted price when data loads
  useState(() => {
    if (request?.quotedPrice) setQuotedPrice(request.quotedPrice.toString());
  });

  const updateMutation = useMutation({
    mutationFn: ({ status, price }: { status: string; price?: number }) =>
      quoteApi.updateQuoteStatus(id!, status, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
      queryClient.invalidateQueries({ queryKey: ['quote-request', id] });
      toast.success('Cập nhật trạng thái thành công');
      navigate('/admin/requests');
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });

  const handleUpdate = (newStatus: string) => {
    updateMutation.mutate({
      status: newStatus,
      price: newStatus === 'quoted' ? parseInt(quotedPrice) || undefined : undefined,
    });
  };

  if (isLoading) return <div className="p-12 text-center text-lg">Đang tải...</div>;
  if (isError || !request) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-600 mb-4">Không tìm thấy yêu cầu</p>
        <Link to="/admin/requests" className="text-primary-600 hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  const busy = updateMutation.isPending;

  return (
    <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-secondary-500 mb-6">
        <Link to="/admin/requests" className="hover:text-primary-600">Yêu cầu báo giá</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-secondary-800 font-medium">Chi tiết</span>
      </nav>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/requests')}
          className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Chi tiết yêu cầu</h2>
          <p className="text-sm text-secondary-500">
            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN', { dateStyle: 'long' }) : ''}
          </p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
          {getStatusLabel(request.status)}
        </span>
      </div>

      <div className="space-y-4">
        {/* Customer info */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <h3 className="font-semibold text-secondary-700 mb-4">Thông tin khách hàng</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-secondary-500">Họ tên:</span>
              <p className="font-medium mt-0.5">{request.customerName || 'N/A'}</p>
            </div>
            <div>
              <span className="text-secondary-500">Số điện thoại:</span>
              <p className="font-medium mt-0.5">{request.phone}</p>
            </div>
            {request.email && (
              <div>
                <span className="text-secondary-500">Email:</span>
                <p className="font-medium mt-0.5">{request.email}</p>
              </div>
            )}
            {request.company && (
              <div>
                <span className="text-secondary-500">Công ty:</span>
                <p className="font-medium mt-0.5">{request.company}</p>
              </div>
            )}
            {request.address && (
              <div className="sm:col-span-2">
                <span className="text-secondary-500">Địa chỉ:</span>
                <p className="font-medium mt-0.5">{request.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <h3 className="font-semibold text-secondary-700 mb-4">Thông tin yêu cầu</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-secondary-500">Sản phẩm:</span>
              <p className="font-medium mt-0.5">{request.product}</p>
            </div>
            <div>
              <span className="text-secondary-500">Số lượng:</span>
              <p className="font-medium mt-0.5">{request.quantity}</p>
            </div>
            {request.businessType && (
              <div>
                <span className="text-secondary-500">Loại hình:</span>
                <p className="font-medium mt-0.5">{request.businessType}</p>
              </div>
            )}
            {request.quotedPrice && (
              <div>
                <span className="text-secondary-500">Giá đã báo:</span>
                <p className="font-semibold text-primary-600 mt-0.5">{request.quotedPrice.toLocaleString('vi-VN')}đ</p>
              </div>
            )}
          </div>
          {request.notes && (
            <div className="mt-4">
              <span className="text-secondary-500 text-sm">Ghi chú:</span>
              <p className="mt-1 p-3 bg-secondary-50 rounded-lg text-sm">{request.notes}</p>
            </div>
          )}
        </div>

        {/* Attached files */}
        {(request.files?.length ?? 0) > 0 && (
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <h3 className="font-semibold text-secondary-700 mb-4">Ảnh đính kèm</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {request.files!.map((file, i) => (
                <img
                  key={i}
                  src={file.url}
                  alt={file.name}
                  className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
                  onClick={() => window.open(file.url, '_blank')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {request.status === 'pending' && (
          <div className="bg-white rounded-xl border border-secondary-200 p-6 space-y-4">
            <h3 className="font-semibold text-secondary-700">Xử lý yêu cầu</h3>
            <input
              type="number"
              value={quotedPrice}
              onChange={e => setQuotedPrice(e.target.value)}
              placeholder="Nhập giá báo (VNĐ)"
              className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdate('quoted')}
                disabled={busy || !quotedPrice}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Đã báo giá
              </button>
              <button
                onClick={() => handleUpdate('completed')}
                disabled={busy}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                Hoàn thành
              </button>
            </div>
          </div>
        )}

        {request.status === 'quoted' && (
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <button
              onClick={() => handleUpdate('completed')}
              disabled={busy}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              Đánh dấu hoàn thành
            </button>
          </div>
        )}

        <Link
          to="/admin/requests"
          className="block w-full text-center border-2 border-secondary-300 py-3 rounded-lg hover:bg-secondary-50 text-secondary-700 font-medium"
        >
          Quay lại danh sách
        </Link>
      </div>
    </main>
  );
}
