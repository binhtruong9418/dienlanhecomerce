import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Eye, EyeOff, Edit, Trash2, Package, X, Upload } from 'lucide-react';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import adminApi from '../../api/adminApi';
import RichTextEditor from '../../components/RichTextEditor';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../../utils/imageUtils';
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import toast from 'react-hot-toast';

export function ProductsAdmin() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'active'|'inactive'|'deleted'>('all');
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  // Fetch Products via react-query (admin: all statuses except deleted)
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productApi.getProducts({ limit: 1000, status: 'all' })
  });

  const products = response?.products || [];

  // Fetch Categories via react-query (admin: all statuses)
  const { data: categoriesResult } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryApi.getCategories({ status: 'all' })
  });
  const categories = Array.isArray(categoriesResult) ? categoriesResult : (categoriesResult?.categories || []);

  const createMutation = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Thêm sản phẩm thành công');
      setShowProductModal(false);
    },
    onError: () => toast.error('Lỗi khi thêm sản phẩm')
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) => productApi.updateProduct(editingProduct!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Cập nhật sản phẩm thành công');
      setShowProductModal(false);
    },
    onError: () => toast.error('Lỗi khi cập nhật sản phẩm')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.updateProductStatus(id, 'deleted'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Đã xóa sản phẩm');
    },
    onError: () => toast.error('Xóa sản phẩm thất bại')
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' | 'deleted' }) => productApi.updateProductStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Cập nhật trạng thái thành công');
    }
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', category: '', brand: '', productModel: '', power: '',
      capacity: '', area: '', price: 0, originalPrice: 0, images: [],
      description: '', specifications: [], features: [], inStock: true, stock: 0, status: 'active'
    });
    setImagePreview('');
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      ...product,
      category: typeof product.category === 'object' ? product.category._id : product.category,
    });
    setImagePreview(product.images?.[0] || '');
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...productForm, price: Number(productForm.price) || 0 };
    if (editingProduct) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDescriptionImageUpload = async (file: File) => {
    const res = await adminApi.uploadFile(file, 'products/description');
    return res.url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const response = await adminApi.uploadFile(file, 'products');
        if (response.url) {
          setProductForm({
            ...productForm,
            images: [...(productForm.images || []), response.url]
          });
          setImagePreview(response.url);
          toast.success('Upload ảnh thành công');
        }
      } catch (error) {
        toast.error('Lỗi upload ảnh');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    if (!productForm.images) return;
    const newImages = productForm.images.filter((_, i) => i !== index);
    setProductForm({ ...productForm, images: newImages });
    if (imagePreview === productForm.images[index]) {
      setImagePreview(newImages[0] || '');
    }
  };

  const handleAddSpecification = () => {
    const specs = productForm.specifications || [];
    setProductForm({ ...productForm, specifications: [...specs, { label: '', value: '' }] });
  };

  const handleRemoveSpecification = (index: number) => {
    const specs = productForm.specifications || [];
    setProductForm({ ...productForm, specifications: specs.filter((_, i) => i !== index) });
  };

  const handleSpecificationChange = (index: number, field: 'label' | 'value', value: string) => {
    const specs = [...(productForm.specifications || [])];
    specs[index] = { ...specs[index], [field]: value };
    setProductForm({ ...productForm, specifications: specs });
  };

  const handleAddFeature = () => {
    const features = productForm.features || [];
    setProductForm({ ...productForm, features: [...features, { icon: 'zap', title: '', description: '' }] });
  };

  const handleRemoveFeature = (index: number) => {
    const features = productForm.features || [];
    setProductForm({ ...productForm, features: features.filter((_, i) => i !== index) });
  };

  const handleFeatureChange = (index: number, field: 'icon' | 'title' | 'description', value: string) => {
    const features = [...(productForm.features || [])];
    features[index] = { ...features[index], [field]: value };
    setProductForm({ ...productForm, features: features });
  };

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
          onClick={handleAddProduct}
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
                  <td className="py-4 px-6"><span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{(product.category && typeof product.category === 'object') ? (product.category as Category).name : 'N/A'}</span></td>
                  <td className="py-4 px-6">{product.power}</td>
                  <td className="py-4 px-6">{product.price.toLocaleString('vi-VN')}đ</td>
                  <td className="py-4 px-6">{product.stock}</td>
                  <td className="py-4 px-6">
                    {product.status === 'deleted' ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"><Trash2 className="w-4 h-4" /> Đã xóa</span>
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
                       <button onClick={() => handleEditProduct(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-5 h-5"/></button>
                       <button onClick={() => { if(confirm('Chắc chắn xóa?')) deleteMutation.mutate(product._id); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5"/></button>
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

      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex justify-between z-10">
            <div>
              <h3 className="text-xl font-bold">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
            </div>
            <button type="button" onClick={() => setShowProductModal(false)} className="p-2 hover:bg-secondary-100 rounded-lg"><X className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
             {/* Fields */}
             <div>
               <label className="block text-sm font-semibold mb-2">Tên sản phẩm *</label>
               <input type="text" required value={productForm.name || ''} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" />
             </div>
             
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-semibold mb-2">Danh mục *</label>
                 <select required value={(productForm.category as string) || ''} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg">
                   <option value="">-- Chọn danh mục --</option>
                   {categories.map((cat: Category) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                 </select>
               </div>
               <div><label className="block text-sm font-semibold mb-2">Thương hiệu *</label><input type="text" required value={productForm.brand || ''} onChange={e => setProductForm({...productForm, brand: e.target.value})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" /></div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
               <div><label className="block text-sm font-semibold mb-2">Model</label><input type="text" value={productForm.productModel || ''} onChange={e => setProductForm({...productForm, productModel: e.target.value})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" /></div>
               <div><label className="block text-sm font-semibold mb-2">Công suất *</label><input type="text" required value={productForm.power || ''} onChange={e => setProductForm({...productForm, power: e.target.value})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" /></div>
             </div>
             
             <div className="grid md:grid-cols-2 gap-6">
               <div><label className="block text-sm font-semibold mb-2">Năng lực (BTU)</label><input type="text" value={productForm.capacity || ''} onChange={e => setProductForm({...productForm, capacity: e.target.value})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" /></div>
               <div><label className="block text-sm font-semibold mb-2">Diện tích</label><input type="text" value={productForm.area || ''} onChange={e => setProductForm({...productForm, area: e.target.value})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" /></div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
               <div><label className="block text-sm font-semibold mb-2">Giá bán *</label><input type="number" required value={productForm.price || 0} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value)})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" /></div>
               <div><label className="block text-sm font-semibold mb-2">Giá gốc</label><input type="number" value={productForm.originalPrice || 0} onChange={e => setProductForm({...productForm, originalPrice: parseInt(e.target.value)})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" /></div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
               <div><label className="block text-sm font-semibold mb-2">Tồn kho</label><input type="number" value={productForm.stock || 0} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)})} className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg" /></div>
               <div>
                  <label className="block text-sm font-semibold mb-2">Trạng thái còn hàng</label>
                  <label className="flex items-center pt-3 gap-2 cursor-pointer">
                     <input type="checkbox" checked={productForm.inStock} onChange={e => setProductForm({ ...productForm, inStock: e.target.checked })} className="w-5 h-5 border-2 border-secondary-300 rounded" />
                     <span>Còn hàng</span>
                  </label>
               </div>
             </div>

             {/* Specifications */}
             <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="block text-base font-semibold">Thông số kỹ thuật</label>
                 <button type="button" onClick={handleAddSpecification} className="flex items-center gap-2 px-3 py-2 text-sm border border-secondary-300 rounded-lg hover:bg-secondary-50">
                   <Plus className="w-4 h-4" /> Thêm thông số
                 </button>
               </div>
               <div className="space-y-3">
                 {(productForm.specifications || []).map((spec: { label: string; value: string }, index: number) => (
                   <div key={index} className="flex items-center gap-3">
                     <input type="text" placeholder="Tên thông số (VD: Công nghệ)" value={spec.label || ''} onChange={e => handleSpecificationChange(index, 'label', e.target.value)} className="flex-1 px-4 py-2 border-2 border-secondary-200 rounded-lg" />
                     <input type="text" placeholder="Giá trị (VD: Inverter)" value={spec.value || ''} onChange={e => handleSpecificationChange(index, 'value', e.target.value)} className="flex-1 px-4 py-2 border-2 border-secondary-200 rounded-lg" />
                     <button type="button" onClick={() => handleRemoveSpecification(index)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 className="w-5 h-5"/></button>
                   </div>
                 ))}
               </div>
             </div>

             {/* Features */}
             <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="block text-base font-semibold">Tính năng nổi bật</label>
                 <button type="button" onClick={handleAddFeature} className="flex items-center gap-2 px-3 py-2 text-sm border border-secondary-300 rounded-lg hover:bg-secondary-50">
                   <Plus className="w-4 h-4" /> Thêm tính năng
                 </button>
               </div>
               <div className="space-y-3">
                 {(productForm.features || []).map((feature: { icon: string; title: string; description: string }, index: number) => (
                   <div key={index} className="space-y-2 p-3 border border-secondary-200 bg-secondary-50 rounded-lg">
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">Tính năng {index + 1}</span>
                        <button type="button" onClick={() => handleRemoveFeature(index)} className="p-1 text-red-600 hover:bg-red-100 rounded"><Trash2 className="w-4 h-4"/></button>
                     </div>
                     <div className="grid md:grid-cols-3 gap-3">
                       <select value={feature.icon || 'zap'} onChange={e => handleFeatureChange(index, 'icon', e.target.value)} className="px-3 py-2 border-2 border-secondary-200 rounded-lg">
                         <option value="zap">Tiết kiệm điện</option>
                         <option value="maximize">Diện tích lớn</option>
                         <option value="shield">Bảo hành</option>
                         <option value="wind">Làm mát nhanh</option>
                       </select>
                       <input type="text" placeholder="Tiêu đề" value={feature.title || ''} onChange={e => handleFeatureChange(index, 'title', e.target.value)} className="px-3 py-2 border-2 border-secondary-200 rounded-lg" />
                       <input type="text" placeholder="Mô tả chi tiết" value={feature.description || ''} onChange={e => handleFeatureChange(index, 'description', e.target.value)} className="px-3 py-2 border-2 border-secondary-200 rounded-lg" />
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Rich Text Description */}
             <div>
                <label className="block text-base font-semibold mb-2">Mô tả sản phẩm hiển thị</label>
                <div className="border border-secondary-200 rounded-lg overflow-hidden">
                   <RichTextEditor value={productForm.description || ''} onChange={c => setProductForm({...productForm, description: c})} onImageUpload={handleDescriptionImageUpload} />
                </div>
             </div>

             {/* Thumbnails Upload */}
             <div>
               <label className="block text-base font-semibold mb-2">Ảnh Gallery Sản Phẩm</label>
               <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center mb-4 bg-secondary-50">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-primary-500" />
                  <p className="text-sm mb-1">Kéo thả ảnh hoặc <label className="text-primary-600 font-semibold cursor-pointer">chọn file<input type="file" accept="image/*" className="hidden" onChange={handleFileChange} /></label></p>
                  <p className="text-xs text-secondary-500">JPG, PNG, WEBP</p>
                  {uploading && <p className="text-sm text-primary-600 mt-2 animate-pulse">Đang tải lên...</p>}
               </div>
               
               {/* Images Display */}
               {(productForm.images || []).length > 0 && (
                 <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                   {productForm.images?.map((url, index) => (
                     <div key={index} className="relative group aspect-square">
                       <img src={getSafeImageUrl(url)} className="w-full h-full object-cover rounded border-2 border-secondary-200" onError={e => handleImageError(e, FALLBACK_IMAGES.product)} />
                       <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
                     </div>
                   ))}
                 </div>
               )}
             </div>

             <div className="flex gap-3 pt-6 border-t border-secondary-200">
                <button type="button" disabled={uploading} onClick={() => setShowProductModal(false)} className="px-6 py-3 border-2 border-secondary-200 font-semibold rounded-lg hover:bg-secondary-50 disabled:opacity-50 text-secondary-700">Đóng</button>
                <button type="submit" disabled={uploading} className="flex-1 px-6 py-3 bg-primary-600 font-bold text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                   {editingProduct ? 'Cập nhật Sản phẩm' : 'Đăng Sản phẩm Mới'}
                </button>
             </div>
          </form>
        </div></div>
      )}
    </main>
  );
}
