import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Eye, EyeOff, Edit, Trash2, Package } from 'lucide-react';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../../utils/imageUtils';
import { Category } from '../../types/category';
import toast from 'react-hot-toast';

export function ProductsAdmin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'active'|'inactive'|'deleted'>('all');

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productApi.getProducts({ limit: 1000, status: 'all' })
  });
  const products = response?.products || [];

  // Keep categories loaded so ProductFormPage query cache is warm
  useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryApi.getCategories({ status: 'all' })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.updateProductStatus(id, 'deleted'),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Đã xóa sản phẩm'); },
    onError: () => toast.error('Xóa sản phẩm thất bại')
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' | 'deleted' }) => productApi.updateProductStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Cập nhật trạng thái thành công'); }
  });

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <main className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
          <p className="text-sm text-secondary-600">Thêm, sửa, xóa sản phẩm</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-secondary-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all'|'active'|'inactive'|'deleted')}
          className="px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none bg-white min-w-[200px]"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hiển thị (Active)</option>
          <option value="inactive">Bản nháp (Ẩn)</option>
          <option value="deleted">Đã xóa</option>
        </select>
      </div>

      {isLoading ? <div className="p-12 text-center text-lg">Đang tải...</div> : (
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden text-sm lg:text-base">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="text-left py-4 px-6">Ảnh</th>
                <th className="text-left py-4 px-6">Tên sản phẩm</th>
                <th className="text-left py-4 px-6">Danh mục</th>
                <th className="text-left py-4 px-6">Công suất</th>
                <th className="text-left py-4 px-6">Giá</th>
                <th className="text-left py-4 px-6">Tồn kho</th>
                <th className="text-left py-4 px-6">Trạng thái</th>
                <th className="text-left py-4 px-6">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-4 px-6">
                    <img
                      src={getSafeImageUrl(product.images?.[0])}
                      className="w-16 h-16 object-cover rounded-lg border"
                      onError={(e) => handleImageError(e, FALLBACK_IMAGES.product)}
                    />
                  </td>
                  <td className="py-4 px-6 font-semibold max-w-xs">{product.name}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {(product.category && typeof product.category === 'object') ? (product.category as Category).name : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6">{product.power}</td>
                  <td className="py-4 px-6">{product.price.toLocaleString('vi-VN')}đ</td>
                  <td className="py-4 px-6">{product.stock}</td>
                  <td className="py-4 px-6">
                    {product.status === 'deleted' ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        <Trash2 className="w-4 h-4" /> Đã xóa
                      </span>
                    ) : (
                      <button
                        onClick={() => statusMutation.mutate({ id: product._id, status: product.status === 'active' ? 'inactive' : 'active' })}
                        className="flex items-center gap-2"
                      >
                        {product.status === 'active' ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"><Eye className="w-4 h-4" /> Hiển thị</span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-100 text-secondary-600 rounded-full text-sm"><EyeOff className="w-4 h-4" /> Ẩn</span>
                        )}
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { if (confirm('Chắc chắn xóa?')) deleteMutation.mutate(product._id); }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-secondary-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Không có sản phẩm nào</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
