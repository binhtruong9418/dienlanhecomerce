import { useQuery } from '@tanstack/react-query';
import { Package, MessageSquare, Users, Eye, TrendingUp, ShoppingCart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import adminApi from '../../api/adminApi';
import quoteApi from '../../api/quoteApi';
import { getStatusColor, getStatusLabel } from './utils';
import { QuoteRequest } from '../../types/quote';
import React from 'react';

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType, label: string, value: string | number, color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };
  return (
    <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-secondary-600 text-sm mb-1">{label}</h3>
      <p className="text-3xl font-bold text-secondary-900">{value}</p>
    </div>
  );
}

export function DashboardAdmin() {
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ['adminStats'], queryFn: adminApi.getDashboardStats });
  const { data: quotesData, isLoading: quotesLoading } = useQuery({ queryKey: ['recentQuotes'], queryFn: () => quoteApi.getQuoteRequests({ limit: 4 }) });

  const quoteRequests = quotesData?.requests || [];

  const requestsData = [
    { date: '08/01', requests: 12, quotes: 8 },
    { date: '09/01', requests: 19, quotes: 15 },
    { date: '10/01', requests: 15, quotes: 12 },
    { date: '11/01', requests: 25, quotes: 20 },
    { date: '12/01', requests: 22, quotes: 18 },
    { date: '13/01', requests: 30, quotes: 25 },
    { date: '14/01', requests: 28, quotes: 22 },
  ];

  const productCategoriesData = [
    { name: 'Điều hòa cây', value: 45 },
    { name: 'Quạt điều hòa', value: 28 },
    { name: 'Phụ kiện', value: 15 },
  ];

  if (statsLoading || quotesLoading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <main className="flex-1 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Package} label="Tổng sản phẩm" value={stats?.totalProducts || 0} color="blue" />
        <StatCard icon={MessageSquare} label="Yêu cầu báo giá" value={stats?.totalQuotes?.all || 0} color="green" />
        <StatCard icon={Users} label="Khách hàng mới" value={42} color="purple" />
        <StatCard icon={Eye} label="Lượt truy cập hôm nay" value="1,234" color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Yêu cầu báo giá theo ngày</h3>
              <p className="text-sm text-secondary-500">7 ngày gần nhất</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={requestsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#2563eb" name="Yêu cầu" />
              <Line type="monotone" dataKey="quotes" stroke="#10b981" name="Đã báo giá" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Sản phẩm theo danh mục</h3>
              <p className="text-sm text-secondary-500">Tổng quan phân bổ</p>
            </div>
            <ShoppingCart className="w-5 h-5 text-primary-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productCategoriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-secondary-200">
          <h3 className="font-bold text-lg">Yêu cầu báo giá gần đây</h3>
          <p className="text-sm text-secondary-500">Quản lý và theo dõi yêu cầu từ khách hàng</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-sm">Khách hàng</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Sản phẩm</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Số lượng</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Ngày</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {quoteRequests.map((req: QuoteRequest) => (
                <tr key={req._id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-4 px-6">
                    <div className="font-semibold">{req.customerName || 'N/A'}</div>
                    {req.company && <div className="text-xs text-secondary-500">{req.company}</div>}
                  </td>
                  <td className="py-4 px-6 max-w-xs truncate">{req.product}</td>
                  <td className="py-4 px-6 font-semibold">{req.quantity}</td>
                  <td className="py-4 px-6 text-sm">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                      {getStatusLabel(req.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
