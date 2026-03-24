// components/Categories.tsx
import { Wind, Fan, Settings } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../utils/imageUtils';

interface CategoriesProps {
  onNavigate?: (page: 'products') => void;
}

// Map icon dựa trên tên hoặc slug
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('quạt') || name.includes('fan')) return Fan;
  else if (name.includes('phụ kiện') || name.includes('part')) return Settings;
  return Wind; // Mặc định
};

export function Categories({ onNavigate }: CategoriesProps) {
  const { categories, loading, error } = useCategories();

  // Chỉ lấy categories active
  const activeCategories = categories.filter(c => c.status === 'active');

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">Đang tải danh mục...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  if (activeCategories.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">Chưa có danh mục nào</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Danh mục sản phẩm</h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Cung cấp đầy đủ các giải pháp làm mát chuyên nghiệp cho mọi nhu cầu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {activeCategories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            return (
              <div
                key={category._id}
                className="group bg-white border-2 border-secondary-200 hover:border-primary-500 rounded-2xl overflow-hidden transition-all hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-secondary-100">
                  <img
                    src={getSafeImageUrl(category.image, FALLBACK_IMAGES.category)}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => handleImageError(e, FALLBACK_IMAGES.category)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 right-4 bg-primary-600 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-3">{category.name}</h3>
                  <p className="text-secondary-600 leading-relaxed mb-4 line-clamp-3">
                    {category.description || `Sản phẩm ${category.name} chất lượng cao`}
                  </p>
                  <button 
                    onClick={() => onNavigate?.('products')} 
                    className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    Xem chi tiết
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}