import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductListCard } from '../components/ProductListCard';
import { Filter, Grid, List, ArrowLeft, Loader } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { Product } from '../types/product';

interface ProductListPageProps {
  onNavigate?: (page: 'home' | 'product-detail') => void;
  onProductSelect?: (product: Product) => void;
  categorySlug?: string;
}

export function ProductListPage({ onNavigate, onProductSelect, categorySlug }: ProductListPageProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('q') || undefined;

  const { categories } = useCategories();

  // Find category name from slug for display
  const activeCategory = categorySlug ? categories.find(c => c.slug === categorySlug) : null;

  const {
    products,
    loading,
    total,
    page,
    totalPages,
    filters,
    updateFilters,
    setPage,
  } = useProducts({
    ...(categorySlug ? { category: categorySlug } : {}),
    ...(searchKeyword ? { search: searchKeyword } : {})
  });

  // When categorySlug or search URL navigation changes, update filters
  useEffect(() => {
    updateFilters({
      category: categorySlug || undefined,
      search: searchKeyword || undefined
    });
  }, [categorySlug, searchKeyword]);

  const handleSortChange = (value: string) => {
    switch (value) {
      case 'price-asc':
        updateFilters({ sortBy: 'price', sortOrder: 'asc' });
        break;
      case 'price-desc':
        updateFilters({ sortBy: 'price', sortOrder: 'desc' });
        break;
      case 'name':
        updateFilters({ sortBy: 'name', sortOrder: 'asc' });
        break;
      case 'newest':
        updateFilters({ sortBy: 'createdAt', sortOrder: 'desc' });
        break;
      default:
        updateFilters({ sortBy: 'views', sortOrder: 'desc' });
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-secondary-600 mb-4 flex-wrap">
            <button
              onClick={() => onNavigate?.('home')}
              className="hover:text-primary-600 flex items-center gap-2 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Trang chủ
            </button>
            <span>/</span>
            {activeCategory ? (
              <>
                <a href="/products" className="hover:text-primary-600">Sản phẩm</a>
                <span>/</span>
                <span className="text-secondary-900 font-medium">{activeCategory.name}</span>
              </>
            ) : (
              <span className="text-secondary-900 font-medium">Sản phẩm</span>
            )}
          </div>

          {/* Page Title & Controls — stacked on mobile, row from md */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="mb-2 truncate">
                {searchKeyword
                  ? `Kết quả tìm kiếm cho "${searchKeyword}"`
                  : (activeCategory ? activeCategory.name : 'Tất cả sản phẩm')}
              </h1>
              <p className="text-secondary-600 text-sm">Tìm thấy {total} sản phẩm</p>
            </div>

            {/* Controls row — flex-wrap so items drop to next line before overflowing */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort select — constrained width on small screens */}
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                className="flex-1 min-w-0 sm:flex-none px-3 py-2 text-sm border-2 border-secondary-200 rounded-lg focus:border-primary-500 focus:outline-none bg-white min-h-[44px]"
                defaultValue="popular"
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="name">Tên A-Z</option>
              </select>

              {/* View Mode toggle — Desktop only */}
              <div className="hidden md:flex border-2 border-secondary-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Button — Mobile only, min-h for touch target */}
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 min-h-[44px] bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filter - Desktop */}
          <FilterSidebar
            filters={filters}
            onFilterChange={updateFilters}
          />

          {/* Mobile Filter Drawer */}
          <FilterSidebar
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
            isMobile={true}
            filters={filters}
            onFilterChange={updateFilters}
          />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-secondary-200">
                <p className="text-secondary-600">Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <>
                {/* Grid: 1 col mobile → 2 col sm → 3 col lg → 4 col xl (grid mode only) */}
                <div className={`grid ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                } gap-6`}>
                  {products.map(product => (
                    <ProductListCard
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                      onViewDetail={() => onProductSelect?.(product)}
                    />
                  ))}
                </div>

                {/* Pagination — centered, wrapped for narrow viewports */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      {/* Previous button */}
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg border-2 border-secondary-200 bg-white text-secondary-700 font-medium hover:border-primary-500 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        &laquo;
                      </button>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg border-2 font-medium transition-colors text-sm ${
                            p === page
                              ? 'border-primary-600 bg-primary-600 text-white'
                              : 'border-secondary-200 bg-white text-secondary-700 hover:border-primary-500 hover:text-primary-600'
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      {/* Next button */}
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg border-2 border-secondary-200 bg-white text-secondary-700 font-medium hover:border-primary-500 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        &raquo;
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
