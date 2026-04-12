import { ArrowRight } from 'lucide-react';
import { useFeaturedProducts } from '../hooks/useProducts';
import { Product } from '../types/product';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../utils/imageUtils';

interface FeaturedProductsProps {
  onNavigate?: (page: 'products') => void;
  onProductSelect?: (product: Product) => void;
}

export function FeaturedProducts({ onNavigate, onProductSelect }: FeaturedProductsProps) {
  const { products, loading } = useFeaturedProducts(6);

  if (loading) {
    return (
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Đang tải sản phẩm...</div>
        </div>
      </section>
    );
  }

  // Kiểm tra products có phải là array không
  const productList = Array.isArray(products) ? products : [];

  if (productList.length === 0) {
    return (
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Chưa có sản phẩm nào</div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 bg-secondary-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4">Sản phẩm nổi bật</h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Các sản phẩm được lựa chọn kỹ lưỡng với công suất phù hợp cho nhiều loại không gian
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl overflow-hidden border border-secondary-200 hover:border-primary-500 hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => onProductSelect?.(product)}
            >
              {/* Image — aspect-[4/3] + object-contain để hiện toàn bộ ảnh sản phẩm */}
              <div className="relative aspect-[4/3] bg-secondary-50 overflow-hidden">
                <img
                  src={getSafeImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => handleImageError(e, FALLBACK_IMAGES.product)}
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Hết hàng
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-3">
                <h3 className="text-base font-semibold text-secondary-900 line-clamp-2 min-h-[3rem] leading-snug">
                  {product.name}
                </h3>

                {/* Price */}
                <div>
                  {product.price > 0 ? (
                    <span className="text-xl font-bold text-primary-600">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                  ) : (
                    <span className="text-sm italic text-secondary-500">Liên hệ để báo giá</span>
                  )}
                </div>

                {/* Button */}
                <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        {productList.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate?.('products')}
              className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}