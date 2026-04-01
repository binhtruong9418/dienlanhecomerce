// Product create/edit modal — used in ProductsAdmin
import { useState, useEffect } from 'react';
import { Plus, X, Upload, Trash2 } from 'lucide-react';
import adminApi from '../../api/adminApi';
import RichTextEditor from '../RichTextEditor';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../../utils/imageUtils';
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import toast from 'react-hot-toast';

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  categories: Category[];
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}

const EMPTY_FORM: Partial<Product> = {
  name: '', brand: '', productModel: '', power: '',
  capacity: '', area: '', price: 0, originalPrice: 0,
  images: [], description: '', specifications: [], features: [],
  inStock: true, stock: 0, status: 'active',
};

export function ProductFormModal({ isOpen, editingProduct, categories, isSaving, onClose, onSave }: ProductFormModalProps) {
  const [form, setForm] = useState<Partial<Product>>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);

  // Reset form when modal opens with a different product
  useEffect(() => {
    if (!isOpen) return;
    if (editingProduct) {
      setForm({
        ...editingProduct,
        category: typeof editingProduct.category === 'object' ? editingProduct.category._id : editingProduct.category,
      });
    } else {
      setForm({ ...EMPTY_FORM, category: '' });
    }
  }, [isOpen, editingProduct]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, price: Number(form.price) || 0 });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(e.target.files[0], 'products');
      if (res.url) {
        setForm(prev => ({ ...prev, images: [...(prev.images || []), res.url] }));
        toast.success('Upload ảnh thành công');
      }
    } catch { toast.error('Lỗi upload ảnh'); }
    finally { setUploading(false); }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }));
  };

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

  const busy = uploading || isSaving;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex justify-between z-10">
          <h3 className="text-xl font-bold">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-secondary-100 rounded-lg"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Tên sản phẩm *</label>
            <input type="text" required value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Danh mục *</label>
              <select required value={(form.category as string) || ''} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg">
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Thương hiệu *</label>
              <input type="text" required value={form.brand || ''} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Model</label>
              <input type="text" value={form.productModel || ''} onChange={e => setForm(p => ({ ...p, productModel: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Công suất *</label>
              <input type="text" required value={form.power || ''} onChange={e => setForm(p => ({ ...p, power: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Năng lực (BTU)</label>
              <input type="text" value={form.capacity || ''} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Diện tích</label>
              <input type="text" value={form.area || ''} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Giá bán *</label>
              <input type="number" required value={form.price || 0} onChange={e => setForm(p => ({ ...p, price: parseInt(e.target.value) }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Giá gốc</label>
              <input type="number" value={form.originalPrice || 0} onChange={e => setForm(p => ({ ...p, originalPrice: parseInt(e.target.value) }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Tồn kho</label>
              <input type="number" value={form.stock || 0} onChange={e => setForm(p => ({ ...p, stock: parseInt(e.target.value) }))} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Trạng thái còn hàng</label>
              <label className="flex items-center pt-3 gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.inStock} onChange={e => setForm(p => ({ ...p, inStock: e.target.checked }))} className="w-5 h-5 border-2 border-secondary-300 rounded" />
                <span>Còn hàng</span>
              </label>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-base font-semibold">Thông số kỹ thuật</label>
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
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-base font-semibold">Tính năng nổi bật</label>
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
          <div>
            <label className="block text-base font-semibold mb-2">Mô tả sản phẩm</label>
            <div className="border border-secondary-200 rounded-lg overflow-hidden">
              <RichTextEditor
                value={form.description || ''}
                onChange={c => setForm(p => ({ ...p, description: c }))}
                onImageUpload={async (file) => { const res = await adminApi.uploadFile(file, 'products/description'); return res.url; }}
              />
            </div>
          </div>

          {/* Image gallery upload */}
          <div>
            <label className="block text-base font-semibold mb-2">Ảnh Gallery Sản Phẩm</label>
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

          <div className="flex gap-3 pt-6 border-t border-secondary-200">
            <button type="button" disabled={busy} onClick={onClose} className="px-6 py-3 border-2 border-secondary-200 font-semibold rounded-lg hover:bg-secondary-50 disabled:opacity-50 text-secondary-700">
              Đóng
            </button>
            <button type="submit" disabled={busy} className="flex-1 px-6 py-3 bg-primary-600 font-bold text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {editingProduct ? 'Cập nhật Sản phẩm' : 'Đăng Sản phẩm Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
