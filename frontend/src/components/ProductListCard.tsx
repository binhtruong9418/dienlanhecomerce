// ProductListCard.tsx — Card sản phẩm dùng trong trang danh sách /products
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Product } from '../types/product';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../utils/imageUtils';

interface ProductListCardProps {
  product: Product;
  viewMode?: 'grid' | 'list'; // prop kept for API compatibility, layout handled by parent grid
  onViewDetail?: () => void;
}

export function ProductListCard({ product, onViewDetail, viewMode: _viewMode }: ProductListCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="bg-white border border-secondary-200 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-xl transition-all group cursor-pointer">
      {/* Image — aspect-[4/3] + object-contain hiển thị toàn bộ sản phẩm, không bị crop */}
      <div className="relative aspect-[4/3] bg-secondary-50 overflow-hidden">
        <img
          src={getSafeImageUrl(product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => handleImageError(e, FALLBACK_IMAGES.product)}
        />

        {/* Stock badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
          product.inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {product.inStock && <CheckCircle className="w-3 h-3" />}
          {product.inStock ? 'Còn hàng' : 'Hết hàng'}
        </div>

        {/* Category badge */}
        {product.category?.name && (
          <div className="absolute top-3 left-3 bg-primary-600/90 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
            {product.category.name}
          </div>
        )}

        {/* Discount badge */}
        {discountPct > 0 && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
            -{discountPct}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Name — 2 dòng cố định giữ chiều cao card đồng đều */}
        <h3 className="text-base font-semibold text-secondary-900 line-clamp-2 min-h-[3rem] leading-snug">
          {product.name}
        </h3>

        {/* Price */}
        <div>
          {product.price > 0 ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xl font-bold text-primary-600">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
              {hasDiscount && (
                <span className="text-sm text-secondary-400 line-through">
                  {product.originalPrice!.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm italic text-secondary-500">Liên hệ để báo giá</span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={onViewDetail}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
        >
          Xem chi tiết
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
