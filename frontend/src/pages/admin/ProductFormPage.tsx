// Admin product create/edit full page — replaces ProductFormModal
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Upload, Trash2, X, ChevronRight, Eye } from 'lucide-react';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import adminApi from '../../api/adminApi';
import RichTextEditor from '../../components/RichTextEditor';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../../utils/imageUtils';
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import toast from 'react-hot-toast';
import { useImageCrop, validateImageFile } from '../../hooks/use-image-crop';
import { Switch } from '../../components/ui/switch';

const DEFAULT_FIELD_VISIBILITY = { brand: true, model: true, power: true, capacity: true, area: true };

const EMPTY_FORM: Partial<Product> = {
  name: '', brand: '', productModel: '', power: '',
  capacity: '', area: '', price: 0, originalPrice: 0,
  images: [], description: '', specifications: [], features: [],
  inStock: true, stock: 0, status: 'active',
  fieldVisibility: { ...DEFAULT_FIELD_VISIBILITY },
};

// Visibility field definitions
const VISIBILITY_FIELDS: { key: keyof typeof DEFAULT_FIELD_VISIBILITY; label: string }[] = [
  { key: 'brand',    label: 'Thương hiệu' },
  { key: 'model',    label: 'Model'        },
  { key: 'power',    label: 'Công suất'   },
  { key: 'capacity', label: 'Năng lực'    },
  { key: 'area',     label: 'Diện tích'   },
];

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [form, setForm] = useState<Partial<Product>>({ ...EMPTY_FORM, category: '' });
  const [uploading, setUploading] = useState(false);
  // Image crop — free aspect ratio for product gallery images
  const { openCrop, CropModalElement } = useImageCrop();
  // Queue of files waiting to be cropped (for multi-file selection)
  const cropQueueRef = useRef<File[]>([]);

  // Fetch existing product when editing
  const { data: existingProduct, isLoading: loadingProduct } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => productApi.getProductById(id!),
    enabled: isEdit,
  });

  const { data: categoriesResult } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryApi.getCategories({ status: 'all' }),
  });
  const categories: Category[] = Array.isArray(categoriesResult)
    ? categoriesResult
    : (categoriesResult?.categories || []);

  // Pre-fill form when product data loads
  useEffect(() => {
    if (existingProduct) {
      setForm({
        ...existingProduct,
        category: typeof existingProduct.category === 'object'
          ? existingProduct.category._id
          : existingProduct.category,
      });
    }
  }, [existingProduct]);

  const createMutation = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Thêm sản phẩm thành công');
      navigate('/admin/products');
    },
    onError: () => toast.error('Lỗi khi thêm sản phẩm'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) => productApi.updateProduct(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Cập nhật sản phẩm thành công');
      navigate('/admin/products');
    },
    onError: () => toast.error('Lỗi khi cập nhật sản phẩm'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price) || 0 };
    if (isEdit) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  /** Upload a single already-cropped (or validated) file to Cloudinary */
  const uploadSingleFile = async (file: File) => {
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file, 'products');
      if (res.url) {
        setForm(prev => ({ ...prev, images: [...(prev.images || []), res.url] }));
        toast.success('Upload ảnh thành công');
      }
    } catch { toast.error('Lỗi upload ảnh'); }
    finally { setUploading(false); }
  };

  /** After crop confirm for one file, upload it then process next in queue */
  const handleCropConfirm = (croppedFile: File) => {
    uploadSingleFile(croppedFile);
    // Dequeue next file for crop if any remain
    if (cropQueueRef.current.length > 0) {
      const next = cropQueueRef.current.shift()!;
      openCrop(next, handleCropConfirm);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Reset input so same file can be re-selected
    e.target.value = '';
    if (files.length === 0) return;

    // Validate all files at boundary before opening crop
    const valid = files.filter(f => {
      const err = validateImageFile(f);
      if (err) { toast.error(`${f.name}: ${err}`); return false; }
      return true;
    });
    if (valid.length === 0) return;

    // Queue all after the first; open crop for the first immediately
    cropQueueRef.current = valid.slice(1);
    openCrop(valid[0], handleCropConfirm);
  };

  const removeImage = (index: number) =>
    setForm(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }));

  const addSpec = () => setForm(prev => ({ ...prev, specifications: [...(prev.specifications || []), { label: '', value: '' }] }));
  const removeSpec = (i: number) => setForm(prev => ({ ...prev, specifications: (prev.specifications || []).filter((_, idx) => idx !== i) }));
  const updateSpec = (i: number, field: 'label' | 'value', val: string) => {
    const specs = [...(form.specifications || [])];
    specs[i] = { ...specs[i], [field]: val };
    setForm(prev => ({ ...prev, specifications: specs }));
  };

  const addFeature = () => setForm(prev => ({ ...prev, features: [...(prev.features || []), { icon: 'zap', title: '', description: '' }] }));
  const removeFeature = (i: number) => setForm(prev => ({ ...prev, features: (prev.features || []).filter((_, idx) => idx !== i) }));
  const updateFeature = (i: number, field: 'icon' | 'title' | 'description', val: string) => {
    const features = [...(form.features || [])];
    features[i] = { ...features[i], [field]: val };
    setForm(prev => ({ ...prev, features }));
  };

  const busy = uploading || createMutation.isPending || updateMutation.isPending;

  if (isEdit && loadingProduct) return <div className="p-12 text-center">Đang tải...</div>;

  return (
    <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-secondary-500 mb-6">
        <Link to="/admin/products" className="hover:text-primary-600">Sản phẩm</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-secondary-800 font-medium">{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}</span>
      </nav>

      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-secondary-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Tên sản phẩm *</label>
            <input type="text" required value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Danh mục *</label>
              <select required value={(form.category as string) || ''} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none">
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Thương hiệu *</label>
              <input type="text" required value={form.brand || ''} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Model</label>
              <input type="text" value={form.productModel || ''} onChange={e => setForm(p => ({ ...p, productModel: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Công suất *</label>
              <input type="text" required value={form.power || ''} onChange={e => setForm(p => ({ ...p, power: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Năng lực (BTU)</label>
              <input type="text" value={form.capacity || ''} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Diện tích</label>
              <input type="text" value={form.area || ''} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Giá bán *</label>
              <input type="number" required value={form.price || 0} onChange={e => setForm(p => ({ ...p, price: parseInt(e.target.value) }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Giá gốc</label>
              <input type="number" value={form.originalPrice || 0} onChange={e => setForm(p => ({ ...p, originalPrice: parseInt(e.target.value) }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Tồn kho</label>
              <input type="number" value={form.stock || 0} onChange={e => setForm(p => ({ ...p, stock: parseInt(e.target.value) }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Trạng thái còn hàng</label>
              <label className="flex items-center pt-3 gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.inStock} onChange={e => setForm(p => ({ ...p, inStock: e.target.checked }))} className="w-5 h-5 border-2 border-secondary-300 rounded" />
                <span>Còn hàng</span>
              </label>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-base font-semibold">Thông số kỹ thuật</label>
            <button type="button" onClick={addSpec} className="flex items-center gap-2 px-3 py-2 text-sm border border-secondary-300 rounded-lg hover:bg-secondary-50">
              <Plus className="w-4 h-4" /> Thêm thông số
            </button>
          </div>
          <div className="space-y-3">
            {(form.specifications || []).map((spec, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="text" placeholder="Tên thông số" value={spec.label || ''} onChange={e => updateSpec(i, 'label', e.target.value)} className="flex-1 px-4 py-2 border-2 border-secondary-200 rounded-lg" />
                <input type="text" placeholder="Giá trị" value={spec.value || ''} onChange={e => updateSpec(i, 'value', e.target.value)} className="flex-1 px-4 py-2 border-2 border-secondary-200 rounded-lg" />
                <button type="button" onClick={() => removeSpec(i)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-base font-semibold">Tính năng nổi bật</label>
            <button type="button" onClick={addFeature} className="flex items-center gap-2 px-3 py-2 text-sm border border-secondary-300 rounded-lg hover:bg-secondary-50">
              <Plus className="w-4 h-4" /> Thêm tính năng
            </button>
          </div>
          <div className="space-y-3">
            {(form.features || []).map((feature, i) => (
              <div key={i} className="space-y-2 p-3 border border-secondary-200 bg-secondary-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">Tính năng {i + 1}</span>
                  <button type="button" onClick={() => removeFeature(i)} className="p-1 text-red-600 hover:bg-red-100 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <select value={feature.icon || 'zap'} onChange={e => updateFeature(i, 'icon', e.target.value)} className="px-3 py-2 border-2 border-secondary-200 rounded-lg">
                    <option value="zap">Tiết kiệm điện</option>
                    <option value="maximize">Diện tích lớn</option>
                    <option value="shield">Bảo hành</option>
                    <option value="wind">Làm mát nhanh</option>
                  </select>
                  <input type="text" placeholder="Tiêu đề" value={feature.title || ''} onChange={e => updateFeature(i, 'title', e.target.value)} className="px-3 py-2 border-2 border-secondary-200 rounded-lg" />
                  <input type="text" placeholder="Mô tả chi tiết" value={feature.description || ''} onChange={e => updateFeature(i, 'description', e.target.value)} className="px-3 py-2 border-2 border-secondary-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <label className="block text-base font-semibold mb-3">Mô tả sản phẩm</label>
          <div className="border border-secondary-200 rounded-lg overflow-hidden">
            <RichTextEditor
              value={form.description || ''}
              onChange={c => setForm(p => ({ ...p, description: c }))}
              onImageUpload={async (file) => { const res = await adminApi.uploadFile(file, 'products/description'); return res.url; }}
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <label className="block text-base font-semibold mb-3">Ảnh Gallery Sản Phẩm</label>
          <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center mb-4 bg-secondary-50">
            <Upload className="w-8 h-8 mx-auto mb-2 text-primary-500" />
            <p className="text-sm mb-1">
              Kéo thả ảnh hoặc{' '}
              <label className="text-primary-600 font-semibold cursor-pointer">
                chọn file<input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </p>
            <p className="text-xs text-secondary-500">JPG, PNG, WEBP</p>
            {uploading && <p className="text-sm text-primary-600 mt-2 animate-pulse">Đang tải lên...</p>}
          </div>
          {(form.images || []).length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {form.images?.map((url, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={getSafeImageUrl(url)} className="w-full h-full object-cover rounded border-2 border-secondary-200" onError={e => handleImageError(e, FALLBACK_IMAGES.product)} />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Field Visibility */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-secondary-500" />
            <label className="text-base font-semibold">Hiển thị trên trang sản phẩm</label>
          </div>
          <p className="text-xs text-secondary-400 mb-4">Chọn các trường thông tin hiển thị với khách hàng</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {VISIBILITY_FIELDS.map(({ key, label }) => {
              const isOn = form.fieldVisibility?.[key] ?? true;
              const toggle = () =>
                setForm(p => ({
                  ...p,
                  fieldVisibility: { ...DEFAULT_FIELD_VISIBILITY, ...p.fieldVisibility, [key]: !(p.fieldVisibility?.[key] ?? true) },
                }));
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                    isOn ? 'border-primary-200 bg-primary-50/60' : 'border-secondary-200 bg-secondary-50'
                  }`}
                  onClick={toggle}
                >
                  <span className={`text-sm font-medium ${isOn ? 'text-secondary-900' : 'text-secondary-400'}`}>
                    {label}
                  </span>
                  <Switch
                    checked={isOn}
                    onCheckedChange={toggle}
                    onClick={e => e.stopPropagation()}
                    className="data-[state=checked]:bg-primary-600 data-[state=unchecked]:bg-secondary-200 h-5 w-9"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <Link to="/admin/products" className="px-6 py-3 border-2 border-secondary-200 font-semibold rounded-lg hover:bg-secondary-50 text-secondary-700">
            Hủy
          </Link>
          <button type="submit" disabled={busy} className="flex-1 px-6 py-3 bg-primary-600 font-bold text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {busy ? 'Đang lưu...' : isEdit ? 'Cập nhật Sản phẩm' : 'Đăng Sản phẩm Mới'}
          </button>
        </div>
      </form>
      {CropModalElement}
    </main>
  );
}
