import { useQuery } from '@tanstack/react-query';
import { Package, MessageSquare, Users, Eye, TrendingUp, BarChart2, Monitor, Smartphone, Tablet, Globe } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import adminApi from '../../api/adminApi';
import quoteApi from '../../api/quoteApi';
import { getStatusColor, getStatusLabel } from './utils';
import { QuoteRequest } from '../../types/quote';
import React from 'react';

// --- Helpers ---

const DEVICE_ICONS: Record<string, React.ElementType> = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
};

const TRAFFIC_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

/** Translate GA4 channel group names to Vietnamese */
function channelLabel(ch: string): string {
  const map: Record<string, string> = {
    'Organic Search': 'Tìm kiếm',
    'Direct': 'Trực tiếp',
    'Organic Social': 'Mạng xã hội',
    'Referral': 'Giới thiệu',
    'Paid Search': 'Quảng cáo',
    'Email': 'Email',
    'Unassigned': 'Khác',
  };
  return map[ch] ?? ch;
}

// --- Sub-components ---

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500', orange: 'bg-orange-500',
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
      {sub && <p className="text-xs text-secondary-400 mt-1">{sub}</p>}
    </div>
  );
}

// --- Main Component ---

export function DashboardAdmin() {
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ['adminStats'], queryFn: adminApi.getDashboardStats });
  const { data: quotesData, isLoading: quotesLoading } = useQuery({ queryKey: ['recentQuotes'], queryFn: () => quoteApi.getQuoteRequests({ limit: 4 }) });
  const { data: timeseriesData } = useQuery({ queryKey: ['adminTimeseries'], queryFn: adminApi.getTimeseries });
  const { data: ga4Data } = useQuery({ queryKey: ['adminGa4'], queryFn: adminApi.getGa4Stats });

  const quoteRequests = quotesData?.requests || [];
  const ga4 = ga4Data?.ga4;

  // Transform timeseries for quote trend chart
  const chartData = timeseriesData?.timeseries?.map(d => ({
    name: new Date(d.date + 'T00:00:00+07:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    'Yêu cầu': d.quoteCount,
    'Đã báo giá': d.quotedCount,
  })) ?? [];

  // Transform GA4 daily sessions for traffic chart
  const trafficData = ga4?.available && ga4.dailySessions
    ? ga4.dailySessions.map(d => ({
        name: new Date(d.date + 'T00:00:00+07:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        'Phiên': d.sessions,
        'Lượt xem': d.pageviews,
      }))
    : null;

  // Traffic sources for pie chart
  const sourceData = ga4?.available && ga4.trafficSources?.length
    ? ga4.trafficSources.map(s => ({ name: channelLabel(s.channel), value: s.sessions }))
    : null;

  if (statsLoading || quotesLoading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Package} label="Tổng sản phẩm" value={stats?.totalProducts || 0} color="blue" />
        <StatCard icon={MessageSquare} label="Yêu cầu báo giá" value={stats?.totalQuotes?.all || 0} color="green" />
        <StatCard icon={Users} label="Khách hàng" value={timeseriesData?.uniqueCustomers?.toLocaleString() ?? '—'} color="purple" />
        <StatCard
          icon={Eye}
          label="Lượt xem hôm nay"
          value={ga4?.available ? (ga4.pageviewsToday?.toLocaleString() ?? '0') : '—'}
          sub={ga4?.available ? `${ga4.totalPageviews7d?.toLocaleString() ?? 0} lượt / 7 ngày` : undefined}
          color="orange"
        />
      </div>

      {/* Website traffic overview + Top 5 pages — always visible */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Traffic summary */}
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Tổng lượt truy cập website</h3>
              <p className="text-xs text-secondary-400">Google Analytics · 7 ngày gần nhất</p>
            </div>
            <Globe className="w-5 h-5 text-secondary-400" />
          </div>
          {ga4?.available ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Lượt xem trang', value: ga4.totalPageviews7d?.toLocaleString() ?? '0', color: 'text-blue-600' },
                { label: 'Phiên truy cập', value: ga4.totalSessions7d?.toLocaleString() ?? '0', color: 'text-green-600' },
                { label: 'Người dùng', value: ga4.totalUsers7d?.toLocaleString() ?? '0', color: 'text-purple-600' },
                { label: 'Người dùng mới', value: ga4.newUsers7d?.toLocaleString() ?? '0', color: 'text-orange-600' },
              ].map(item => (
                <div key={item.label} className="bg-secondary-50 rounded-lg p-3">
                  <p className="text-xs text-secondary-500 mb-1">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {['Lượt xem trang', 'Phiên truy cập', 'Người dùng', 'Người dùng mới'].map(label => (
                <div key={label} className="bg-secondary-50 rounded-lg p-3">
                  <p className="text-xs text-secondary-500 mb-1">{label}</p>
                  <p className="text-2xl font-bold text-secondary-300">—</p>
                </div>
              ))}
              <p className="col-span-2 text-xs text-secondary-400 text-center pt-1">Cần cấu hình GA4 để xem số liệu</p>
            </div>
          )}
        </div>

        {/* Top 5 pages */}
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Top 5 trang xem nhiều nhất</h3>
              <p className="text-xs text-secondary-400">Google Analytics · 7 ngày gần nhất</p>
            </div>
            <Eye className="w-5 h-5 text-secondary-400" />
          </div>
          {ga4?.available && ga4.topPages?.length ? (
            <div className="space-y-3">
              {ga4.topPages.map((p, i) => {
                const maxViews = ga4.topPages![0]?.views || 1;
                const pct = Math.round((p.views / maxViews) * 100);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-secondary-400 w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-secondary-700 truncate" title={p.path}>{p.path}</span>
                        <span className="text-sm font-bold text-secondary-900 shrink-0 ml-2">{p.views.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-secondary-100 rounded-full h-1.5">
                        <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-secondary-300 w-4 shrink-0">{i}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <div className="h-4 bg-secondary-100 rounded w-2/3" />
                      <div className="h-4 bg-secondary-100 rounded w-10" />
                    </div>
                    <div className="w-full bg-secondary-100 rounded-full h-1.5" />
                  </div>
                </div>
              ))}
              <p className="text-xs text-secondary-400 text-center pt-1">Cần cấu hình GA4 để xem số liệu</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts row 1: Quote trend + Traffic */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Yêu cầu báo giá theo ngày</h3>
              <p className="text-sm text-secondary-500">7 ngày gần nhất</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Yêu cầu" stroke="#2563eb" dot={false} />
              <Line type="monotone" dataKey="Đã báo giá" stroke="#10b981" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Lưu lượng truy cập</h3>
              <p className="text-sm text-secondary-500">Phiên & lượt xem 7 ngày</p>
            </div>
            <BarChart2 className="w-5 h-5 text-primary-600" />
          </div>
          {trafficData ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Phiên" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Lượt xem" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[260px] text-center text-secondary-500 gap-3">
              <BarChart2 className="w-10 h-10 text-secondary-300" />
              <p className="font-semibold text-secondary-600">GA4 chưa được cấu hình</p>
              <p className="text-sm max-w-xs">
                Thêm <code className="bg-secondary-100 px-1 rounded">GA4_PROPERTY_ID</code> và{' '}
                <code className="bg-secondary-100 px-1 rounded">GA4_SERVICE_ACCOUNT_PATH</code>{' '}
                vào file <code className="bg-secondary-100 px-1 rounded">.env</code>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Charts row 2: Traffic sources + Device breakdown + Top pages */}
      {ga4?.available && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Traffic sources pie */}
          {sourceData && (
            <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
              <h3 className="font-bold text-base mb-4">Nguồn truy cập</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={TRAFFIC_COLORS[i % TRAFFIC_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v} phiên`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Device breakdown */}
          {ga4.deviceBreakdown && ga4.deviceBreakdown.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
              <h3 className="font-bold text-base mb-4">Thiết bị truy cập</h3>
              <div className="space-y-3 mt-2">
                {ga4.deviceBreakdown.map(d => {
                  const total = ga4.deviceBreakdown!.reduce((s, x) => s + x.sessions, 0);
                  const pct = total > 0 ? Math.round((d.sessions / total) * 100) : 0;
                  const DevIcon = DEVICE_ICONS[d.device] ?? Monitor;
                  return (
                    <div key={d.device}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-sm">
                          <DevIcon className="w-4 h-4 text-secondary-500" />
                          <span className="capitalize">{d.device === 'mobile' ? 'Di động' : d.device === 'desktop' ? 'Máy tính' : 'Máy tính bảng'}</span>
                        </div>
                        <span className="text-sm font-semibold">{pct}%</span>
                      </div>
                      <div className="w-full bg-secondary-100 rounded-full h-2">
                        <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-secondary-400 mt-1">{d.sessions.toLocaleString()} phiên</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Top product pages from GA4 (last 30 days) */}
      {ga4?.available && ga4.topProductPages && ga4.topProductPages.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Sản phẩm xem nhiều nhất</h3>
              <p className="text-xs text-secondary-400">Dữ liệu GA4 · 30 ngày gần nhất</p>
            </div>
          </div>
          <div className="space-y-3">
            {ga4.topProductPages.map((p, i) => {
              const maxViews = ga4.topProductPages![0]?.views || 1;
              const pct = Math.round((p.views / maxViews) * 100);
              return (
                <div key={p.path} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-secondary-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate capitalize" title={p.path}>{p.name}</span>
                      <span className="text-sm font-bold text-secondary-700 shrink-0 ml-2">{p.views.toLocaleString()} lượt</span>
                    </div>
                    <div className="w-full bg-secondary-100 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent quotes table */}
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
