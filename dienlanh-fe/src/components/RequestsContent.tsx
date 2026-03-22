// RequestsContent.tsx
import { Search, MessageSquare } from 'lucide-react';
import { QuoteRequest } from '../types/quote';

interface RequestsContentProps {
  quoteRequests: QuoteRequest[];
  searchTerm: string;
  statusFilter: 'all' | 'pending' | 'quoted' | 'completed';
  filteredQuoteRequests: QuoteRequest[];
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (status: 'all' | 'pending' | 'quoted' | 'completed') => void;
  onViewDetail: (request: QuoteRequest) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function RequestsContent({
  quoteRequests,
  searchTerm,
  statusFilter,
  filteredQuoteRequests,
  onSearchChange,
  onStatusFilterChange,
  onViewDetail,
  getStatusColor,
  getStatusLabel,
}: RequestsContentProps) {
  return (
    <main className="flex-1 p-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600">Chờ xử lý</span>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <MessageSquare className="w-5 h-5 text-yellow-700" />
            </div>
          </div>
          <p className="text-3xl font-bold text-secondary-900">
            {quoteRequests.filter((r) => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600">Đã báo giá</span>
            <div className="bg-blue-100 p-2 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-700" />
            </div>
          </div>
          <p className="text-3xl font-bold text-secondary-900">
            {quoteRequests.filter((r) => r.status === 'quoted').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600">Hoàn thành</span>
            <div className="bg-green-100 p-2 rounded-lg">
              <MessageSquare className="w-5 h-5 text-green-700" />
            </div>
          </div>
          <p className="text-3xl font-bold text-secondary-900">
            {quoteRequests.filter((r) => r.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-secondary-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, SĐT, sản phẩm..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none transition-colors"
            />
          </div>
          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Tất cả ({quoteRequests.length})
            </button>
            <button
              onClick={() => onStatusFilterChange('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Chờ xử lý ({quoteRequests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => onStatusFilterChange('quoted')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'quoted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Đã báo giá ({quoteRequests.filter(r => r.status === 'quoted').length})
            </button>
            <button
              onClick={() => onStatusFilterChange('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Hoàn thành ({quoteRequests.filter(r => r.status === 'completed').length})
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-sm text-secondary-700">
                  Tên khách hàng
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-secondary-700">
                  SĐT
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-secondary-700">
                  Email
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-secondary-700">
                  Sản phẩm
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-secondary-700">
                  Số lượng
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-secondary-700">
                  Ngày
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-secondary-700">
                  Trạng thái
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-secondary-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQuoteRequests.map((request) => (
                <tr
                  key={request._id || request.id}
                  className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-secondary-900">{request.customerName}</div>
                      {request.company && (
                        <div className="text-xs text-secondary-500">{request.company}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-secondary-700">{request.phone}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-secondary-700">{request.email}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-secondary-700 max-w-xs truncate">
                      {request.product}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold">{request.quantity}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-secondary-600">{request.date}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusLabel(request.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onViewDetail(request)}
                      className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredQuoteRequests.length === 0 && (
          <div className="py-12 text-center text-secondary-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Không tìm thấy yêu cầu nào</p>
          </div>
        )}
      </div>
    </main>
  );
}