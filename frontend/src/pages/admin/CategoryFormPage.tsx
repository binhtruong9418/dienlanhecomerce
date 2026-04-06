// Admin category create/edit full page — replaces inline modal in CategoriesAdmin
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, X } from 'lucide-react';
import categoryApi from '../../api/categoryApi';
import adminApi from '../../api/adminApi';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../../utils/imageUtils';
import { Category } from '../../types/category';
import { generateSlug } from './utils';
import toast from 'react-hot-toast';
import { useImageCrop, validateImageFile } from '../../hooks/use-image-crop';

export function CategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [form, setForm] = useState<Partial<Category>>({
    name: '', slug: '', description: '', image: '', order: 1, status: 'active',
  });
  const [uploading, setUploading] = useState(false);
  // Square aspect ratio suits category thumbnails
  const { openCrop, CropModalElement } = useImageCrop(1);

  // Fetch categories list to determine default order for new category
  const { data: categoriesResult } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryApi.getCategories({ status: 'all' }),
    enabled: !isEdit,
  });

  // Fetch the specific category when editing
  const { data: allCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ['admin-categories-all'],
    queryFn: () => categoryApi.getCategories({ status: 'all' }),
    enabled: isEdit,
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && allCategories) {
      const cats: Category[] = Array.isArray(allCategories)
        ? allCategories
        : (allCategories?.categories || []);
      const found = cats.find((c: Category) => c._id === id);
      if (found) setForm(found);
    }
  }, [isEdit, allCategories, id]);

  // Set default order for new category
  useEffect(() => {
    if (!isEdit && categoriesResult) {
      const cats: Category[] = Array.isArray(categoriesResult)
        ? categoriesResult
        : (categoriesResult?.categories || []);
      setForm(prev => ({ ...prev, order: cats.length + 1 }));
    }
  }, [isEdit, categoriesResult]);

  /** Upload the cropped file to Cloudinary */
  const uploadCroppedFile = async (file: File) => {
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file, 'categories');
      if (res.url) {
        setForm(prev => ({ ...prev, image: res.url }));
        toast.success('Upload ảnh thành công');
      }
    } catch { toast.error('Lỗi upload ảnh'); }
    finally { setUploading(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input so same file can be re-selected
    e.target.value = '';
    if (!file) return;
    const err = validateImageFile(file);
    if (err) { toast.error(err); return; }
    openCrop(file, uploadCroppedFile);
  };

  const createMutation = useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Thêm danh mục thành công');
      navigate('/admin/categories');
    },
    onError: () => toast.error('Lỗi khi thêm danh mục'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Category>) => categoryApi.updateCategory(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Cập nhật danh mục thành công');
      navigate('/admin/categories');
    },
    onError: () => toast.error('Lỗi khi cập nhật danh mục'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) updateMutation.mutate(form);
    else createMutation.mutate(form);
  };

  const busy = uploading || createMutation.isPending || updateMutation.isPending;

  if (isEdit && loadingCategories) return <div className="p-12 text-center">Đang tải...</div>;

  return (
    <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-secondary-500 mb-6">
        <Link to="/admin/categories" className="hover:text-primary-600">Danh mục</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-secondary-800 font-medium">{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}</span>
      </nav>

      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-secondary-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2">Tên danh mục *</label>
          <input
            type="text"
            required
            value={form.name || ''}
            onChange={e => {
              const name = e.target.value;
              // Auto-generate slug only when creating new category
              if (isEdit) setForm(prev => ({ ...prev, name }));
              else setForm(prev => ({ ...prev, name, slug: generateSlug(name) }));
            }}
            className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Slug {isEdit ? '(không thể thay đổi)' : '*'}
          </label>
          <input
            type="text"
            required
            value={form.slug || ''}
            onChange={e => !isEdit && setForm(prev => ({ ...prev, slug: e.target.value }))}
            readOnly={isEdit}
            className={`w-full px-4 py-3 border-2 border-secondary-200 rounded-lg font-mono focus:border-primary-600 focus:outline-none ${isEdit ? 'bg-secondary-100 text-secondary-500 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Mô tả</label>
          <textarea
            rows={3}
            value={form.description || ''}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Ảnh danh mục</label>
          <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center bg-secondary-50">
            <p className="text-sm">
              <label className="text-primary-600 font-semibold cursor-pointer">
                Chọn ảnh
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </p>
            {uploading && <p className="text-sm text-primary-600 mt-2 animate-pulse">Đang tải lên...</p>}
          </div>
          {form.image && (
            <div className="mt-4 relative w-32">
              <img
                src={getSafeImageUrl(form.image)}
                className="w-32 h-32 object-cover rounded-lg border"
                onError={e => handleImageError(e, FALLBACK_IMAGES.category)}
              />
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Thứ tự</label>
          <input
            type="number"
            min="1"
            value={form.order || 1}
            onChange={e => setForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            to="/admin/categories"
            className="px-6 py-3 border-2 border-secondary-200 font-semibold rounded-lg hover:bg-secondary-50 text-secondary-700"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={busy}
            className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {busy ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm danh mục'}
          </button>
        </div>
      </form>
      {CropModalElement}
    </main>
  );
}
