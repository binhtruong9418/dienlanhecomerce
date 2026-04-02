import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Eye, EyeOff, Edit, Trash2, FolderTree, X } from 'lucide-react';
import categoryApi from '../../api/categoryApi';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../../utils/imageUtils';
import { Category } from '../../types/category';
import toast from 'react-hot-toast';
import { generateSlug } from './utils';
import adminApi from '../../api/adminApi';

export function CategoriesAdmin() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'active'|'inactive'|'deleted'>('all');
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({});
  const [uploading, setUploading] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryApi.getCategories({ status: 'all' })
  });

  const categories: Category[] = Array.isArray(response) ? response : (response?.categories || []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(e.target.files[0], 'categories');
      if (res.url) {
        setCategoryForm(prev => ({ ...prev, image: res.url }));
        toast.success('Upload ảnh thành công');
      }
    } catch {
      toast.error('Lỗi upload ảnh');
    } finally {
      setUploading(false);
    }
  };
  const createMutation = useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Thêm danh mục thành công');
      setShowCategoryModal(false);
    },
    onError: () => toast.error('Lỗi khi thêm danh mục')
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Category>) => categoryApi.updateCategory(editingCategory!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Cập nhật thành công');
      setShowCategoryModal(false);
    },
    onError: () => toast.error('Lỗi khi cập nhật danh mục')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryApi.updateCategoryStatus(id, 'deleted'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Đã xóa danh mục');
    },
    onError: () => toast.error('Xóa thất bại')
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' | 'deleted' }) => categoryApi.updateCategoryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Cập nhật trạng thái thành công');
    }
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', slug: '', description: '', image: '', order: categories.length + 1, status: 'active' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm(cat);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) updateMutation.mutate(categoryForm);
    else createMutation.mutate(categoryForm);
  };

  const filteredCategories = categories.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <main className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
          <p className="text-sm text-secondary-600">Thêm, sửa, xóa danh mục</p>
        </div>
        <button onClick={handleAddCategory} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700">
          <Plus className="w-5 h-5" /> Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-secondary-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none" />
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
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="text-left py-4 px-6">Ảnh</th>
                <th className="text-left py-4 px-6">Tên</th>
                <th className="text-left py-4 px-6">Slug</th>
                <th className="text-left py-4 px-6">Trạng thái</th>
                <th className="text-left py-4 px-6">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(item => (
                <tr key={item._id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-4 px-6"><img src={getSafeImageUrl(item.image)} className="w-16 h-16 object-cover rounded-lg" onError={e => handleImageError(e, FALLBACK_IMAGES.category)}/></td>
                  <td className="py-4 px-6 font-semibold">{item.name}</td>
                  <td className="py-4 px-6"><code className="px-2 py-1 bg-secondary-100 rounded text-sm">{item.slug}</code></td>
                  <td className="py-4 px-6">
                    {item.status === 'deleted' ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"><Trash2 className="w-4 h-4"/> Đã xóa</span>
                    ) : (
                      <button onClick={() => statusMutation.mutate({ id: item._id, status: item.status === 'active' ? 'inactive' : 'active' })} className="flex items-center gap-2">
                        {item.status === 'active' ? <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"><Eye className="w-4 h-4"/> Hiển thị</span> : <span className="inline-flex px-3 py-1 bg-secondary-100 text-secondary-600 rounded-full text-sm"><EyeOff className="w-4 h-4"/> Ẩn</span>}
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                       <button onClick={() => handleEditCategory(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-5 h-5"/></button>
                       <button onClick={() => { if(confirm('Chắc chắn xóa?')) deleteMutation.mutate(item._id); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCategories.length === 0 && (
            <div className="py-12 text-center text-secondary-500">
               <FolderTree className="w-12 h-12 mx-auto mb-3 opacity-50" />
               <p>Không có danh mục nào</p>
            </div>
          )}
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-xl w-full">
          <div className="border-b border-secondary-200 px-6 py-4 flex justify-between">
            <h3 className="text-xl font-bold">{editingCategory ? 'Sửa' : 'Thêm'}</h3>
            <button onClick={() => setShowCategoryModal(false)}><X className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tên danh mục *</label>
              <input type="text" required value={categoryForm.name || ''} onChange={e => {
                const name = e.target.value;
                // Only auto-generate slug when creating new category
                if (editingCategory) {
                  setCategoryForm({ ...categoryForm, name });
                } else {
                  setCategoryForm({ ...categoryForm, name, slug: generateSlug(name) });
                }
              }} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Slug {editingCategory ? '(không thể thay đổi)' : '*'}</label>
              <input type="text" required value={categoryForm.slug || ''} onChange={e => !editingCategory && setCategoryForm({...categoryForm, slug: e.target.value})} readOnly={!!editingCategory} className={`w-full px-4 py-3 border-2 border-secondary-200 rounded-lg font-mono ${editingCategory ? 'bg-secondary-100 text-secondary-500 cursor-not-allowed' : ''}`} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Mô tả</label>
              <textarea rows={3} value={categoryForm.description || ''} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Ảnh danh mục</label>
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center bg-secondary-50">
                <p className="text-sm">
                  <label className="text-primary-600 font-semibold cursor-pointer">
                    Chọn ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </p>
                {uploading && (<p className="text-sm text-primary-600 mt-2">Đang tải lên...</p>)}
              </div>
              {categoryForm.image && (
                <div className="mt-4 relative w-32">
                  <img
                    src={getSafeImageUrl(categoryForm.image)}
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={(e) => handleImageError(e, FALLBACK_IMAGES.category)}
                  />
                  <button type="button" onClick={() => setCategoryForm(prev => ({ ...prev, image: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"> ✕ </button>
                </div>
              )}
            </div>
            <div>
               <label className="block text-sm font-semibold mb-2">Thứ tự</label>
               <input type="number" min="1" value={categoryForm.order || 1} onChange={e => setCategoryForm({...categoryForm, order: parseInt(e.target.value)})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowCategoryModal(false)} className="flex-1 py-3 border-2 border-secondary-300 rounded-lg">Hủy</button>
              <button type="submit" className="flex-1 py-3 bg-primary-600 text-white rounded-lg">Lưu</button>
            </div>
          </form>
        </div></div>
      )}
    </main>
  );
}
