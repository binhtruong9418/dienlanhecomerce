import { ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { Product } from '../types/product';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../utils/imageUtils';

interface ProductListCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onViewDetail?: () => void;
}

export function ProductListCard({
  product,
  viewMode = 'grid',
  onViewDetail,
}: ProductListCardProps) {
  return (
    <div className="bg-white border border-secondary-200 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-xl transition-all group">
      {/* Image */}
      <div className="relative h-56 bg-secondary-100 overflow-hidden">
        <img
          src={getSafeImageUrl(product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => handleImageError(e, FALLBACK_IMAGES.product)}
        />
        
        {/* Stock Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
          product.inStock 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {product.inStock && <CheckCircle className="w-3 h-3" />}
          {product.inStock ? 'Còn hàng' : 'Hết hàng'}
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {product.category?.name || 'Sản phẩm'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name */}
        <h3 className="mb-3 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>

        {/* Specifications */}
        <div className="space-y-2 mb-4 bg-secondary-50 p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-secondary-600 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary-600" />
              Công suất:
            </span>
            <span className="font-semibold text-secondary-800">{product.power || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-secondary-600">Năng lực:</span>
            <span className="font-semibold text-secondary-800">{product.capacity || 'N/A'}</span>
          </div>
        </div>

        {/* Button */}
        <button onClick={onViewDetail} className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
          Xem chi tiết
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}