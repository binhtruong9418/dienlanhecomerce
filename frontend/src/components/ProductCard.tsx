import { ShoppingCart, Zap, Wind, Gauge, Star } from 'lucide-react';

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  cooling: string;
  power: string;
  area: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export function ProductCard({
  name,
  image,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  cooling,
  power,
  area,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="bg-white border border-secondary-200 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
      {/* Image — aspect-square + object-cover prevents layout shift at any card width */}
      <div className="relative bg-secondary-50 aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        {badge && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {badge}
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            -{discount}%
          </div>
        )}

        {/* Quick action — hover only, not needed for touch */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white p-2 rounded-lg shadow-lg hover:bg-primary-600 hover:text-white transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-secondary-700">{rating}</span>
          </div>
          <span className="text-xs text-secondary-500">({reviews} đánh giá)</span>
        </div>

        {/* Name — line-clamp-2 prevents unbounded growth; min-h keeps card heights consistent */}
        <h3 className="mb-3 line-clamp-2 min-h-[3.5rem] text-base">{name}</h3>

        {/* Specifications */}
        <div className="space-y-2 mb-4 bg-secondary-50 p-3 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-secondary-600">
              <Wind className="w-4 h-4 text-primary-600 flex-shrink-0" />
              <span>Làm lạnh:</span>
            </div>
            <span className="font-semibold text-secondary-800">{cooling}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-secondary-600">
              <Zap className="w-4 h-4 text-primary-600 flex-shrink-0" />
              <span>Công suất:</span>
            </div>
            <span className="font-semibold text-secondary-800">{power}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-secondary-600">
              <Gauge className="w-4 h-4 text-primary-600 flex-shrink-0" />
              <span>Diện tích:</span>
            </div>
            <span className="font-semibold text-secondary-800">{area}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold text-primary-600">
              {price.toLocaleString('vi-VN')}₫
            </span>
            {originalPrice && (
              <span className="text-sm text-secondary-400 line-through">
                {originalPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
          <p className="text-xs text-secondary-500">Đã bao gồm VAT</p>
        </div>

        {/* Actions — stacked on very small cards, side-by-side from sm; min-h for touch targets */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex-1 bg-primary-600 text-white px-4 py-3 min-h-[44px] rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm">
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </button>
          <button className="border-2 border-primary-600 text-primary-600 px-4 py-3 min-h-[44px] rounded-lg font-semibold hover:bg-primary-50 transition-colors text-sm whitespace-nowrap">
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
