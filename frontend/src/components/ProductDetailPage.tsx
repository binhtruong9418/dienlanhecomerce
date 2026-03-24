// ProductDetailPage.tsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Mail, CheckCircle, Zap, Maximize2, Award, Shield, Truck, HeadphonesIcon, Loader } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import productApi from '../api/productApi';
import { Product } from '../types/product';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../utils/imageUtils';

interface ProductDetailPageProps {
  onNavigate?: (page: 'products' | 'quote-request', productName?: string, productId?: string) => void;
  productId?: string;
}

// Hàm chuyển đổi Markdown images sang HTML
const renderMarkdownImages = (text: string) => {
  if (!text) return text;
  
  // Xử lý ảnh dạng ![alt](url)
  let html = text.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 mx-auto" style="max-height: 400px;" />'
  );
  
  // Xử lý link dạng [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  
  // Xử lý xuống dòng
  html = html.replace(/\n/g, '<br />');
  
  return html;
};

export function ProductDetailPage({ onNavigate, productId }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { product, loading, error } = useProduct(productId || '');

  useEffect(() => {
    if (product?._id) {
      const fetchRelated = async () => {
        try {
          const related = await productApi.getRelatedProducts(product._id, 4);
          setRelatedProducts(related);
        } catch (err) {
          console.error('Failed to fetch related products:', err);
        }
      };
      fetchRelated();
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-secondary-600 mb-6">Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => onNavigate?.('products')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  // Lấy tên category
  const categoryName = typeof product.category === 'object' 
    ? product.category.name 
    : product.category;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <button onClick={() => onNavigate?.('products')} className="hover:text-primary-600 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Danh sách sản phẩm
            </button>
            <span>/</span>
            <span className="text-secondary-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Gallery */}
          <div>
            {/* Main Image */}
            <div className="aspect-square w-full bg-white">
              <img
                src={getSafeImageUrl(product.images?.[selectedImage])}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, FALLBACK_IMAGES.product)}
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-600 scale-105'
                        : 'border-secondary-200 hover:border-primary-400'
                    }`}
                  >
                    
                    <div className="aspect-square">
                      <img
                        src={getSafeImageUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full aspect-square object-cover"
                        onError={(e) => handleImageError(e, FALLBACK_IMAGES.product)}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div>
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-secondary-200 sticky top-20">
              {/* Stock Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                product.inStock 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <CheckCircle className="w-4 h-4" />
                {product.inStock ? 'Còn hàng' : 'Hết hàng'}
              </div>

              {/* Product Name */}
              <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">{product.name}</h1>

              {/* Brand & Model */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-secondary-200">
                <div>
                  <span className="text-sm text-secondary-600">Thương hiệu:</span>
                  <p className="font-semibold text-primary-600">{product.brand}</p>
                </div>
                <div className="h-8 w-px bg-secondary-300"></div>
                <div>
                  <span className="text-sm text-secondary-600">Model:</span>
                  <p className="font-semibold">{product.productModel}</p>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="space-y-3 mb-6 pb-6 border-b border-secondary-200">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-600 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary-600" />
                    Công suất:
                  </span>
                  <span className="font-bold text-lg">{product.power}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-600 flex items-center gap-2">
                    <Maximize2 className="w-5 h-5 text-primary-600" />
                    Diện tích làm mát:
                  </span>
                  <span className="font-bold text-lg">{product.area}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-600">Giá tham khảo:</span>
                  <span className="font-bold text-lg text-primary-600">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => onNavigate?.('quote-request', product.name, product._id)}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Yêu cầu báo giá
                </button>
                <button className="w-full border-2 border-primary-600 text-primary-600 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                  Gọi tư vấn ngay
                </button>
              </div>

              {/* Hotline */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Hotline tư vấn</p>
                      <p className="text-2xl font-bold">1900 xxxx</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm opacity-90 mt-3">Tư vấn miễn phí 24/7</p>
              </div>

              {/* Services */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Shield className="w-4 h-4 text-primary-600" />
                  <span>Bảo hành {product.specifications?.find(s => s.label === 'Bảo hành')?.value || '24 tháng'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Truck className="w-4 h-4 text-primary-600" />
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Award className="w-4 h-4 text-primary-600" />
                  <span>Hàng chính hãng</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <HeadphonesIcon className="w-4 h-4 text-primary-600" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="bg-white rounded-2xl p-8 mb-8 border border-secondary-200">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Tính năng nổi bật</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.features.map((feature, index) => (
                <div key={index} className="text-center p-4 bg-secondary-50 rounded-xl hover:bg-primary-50 transition-colors">
                  <div className="bg-primary-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {feature.icon === 'zap' && <Zap className="w-8 h-8 text-white" />}
                    {feature.icon === 'maximize' && <Maximize2 className="w-8 h-8 text-white" />}
                    {feature.icon === 'shield' && <Shield className="w-8 h-8 text-white" />}
                  </div>
                  <h4 className="font-bold text-secondary-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-secondary-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description - với ảnh từ Markdown */}
        {product.description && (
          <div className="bg-white rounded-2xl p-8 mb-8 border border-secondary-200">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Mô tả chi tiết</h2>
            <div 
              className="prose max-w-none text-secondary-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdownImages(product.description) }}
            />
          </div>
        )}

        {/* Specifications Table */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-white rounded-2xl p-8 mb-12 border border-secondary-200">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Thông số kỹ thuật</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr
                      key={index}
                      className={`border-b border-secondary-200 ${
                        index % 2 === 0 ? 'bg-secondary-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold text-secondary-700 w-1/3">
                        {spec.label}
                      </td>
                      <td className="py-4 px-6 text-secondary-900">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div
                  key={relatedProduct._id}
                  className="bg-white border border-secondary-200 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-xl transition-all group cursor-pointer"
                  onClick={() => onNavigate?.('product-detail', relatedProduct.name, relatedProduct._id)}
                >
                  <div className="aspect-square bg-secondary-100 overflow-hidden">
                    <img
                      src={getSafeImageUrl(relatedProduct.images?.[0])}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => handleImageError(e, FALLBACK_IMAGES.product)}
                    />  
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-secondary-900 mb-2 line-clamp-2 min-h-[3rem]">{relatedProduct.name}</h4>
                    <div className="text-sm text-secondary-600 space-y-1">
                      <p>Công suất: <span className="font-semibold">{relatedProduct.power}</span></p>
                      <p>Năng lực: <span className="font-semibold">{relatedProduct.capacity}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}