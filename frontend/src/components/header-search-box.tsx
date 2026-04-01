// Search box with live dropdown — used in desktop nav and mobile menu
import { Search, Loader } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import productApi from '../api/productApi';
import { useDebounce } from '../hooks/useDebounce';
import { getSafeImageUrl, FALLBACK_IMAGES } from '../utils/imageUtils';

interface HeaderSearchBoxProps {
  onSelect?: () => void; // called after navigating (e.g. close mobile menu)
  className?: string;
  inputClassName?: string;
}

export function HeaderSearchBox({ onSelect, className = '', inputClassName = '' }: HeaderSearchBoxProps) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 500);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results, isFetching } = useQuery({
    queryKey: ['searchProducts', debouncedKeyword],
    queryFn: () => productApi.getProducts({ search: debouncedKeyword, limit: 5 }),
    enabled: debouncedKeyword.length > 0,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToProduct = (slug: string) => {
    setShowDropdown(false);
    navigate(`/product/${slug}`);
    onSelect?.();
  };

  const goToResults = () => {
    if (!keyword.trim()) return;
    setShowDropdown(false);
    navigate(`/products?q=${encodeURIComponent(keyword.trim())}`);
    onSelect?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') goToResults();
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm"
        value={keyword}
        onChange={e => { setKeyword(e.target.value); setShowDropdown(true); }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(true)}
        className={`pl-10 pr-4 py-2 rounded-lg border border-secondary-200 text-secondary-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${inputClassName}`}
      />

      {showDropdown && keyword.trim().length > 0 && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-lg shadow-xl border border-secondary-200 overflow-hidden z-50">
          {isFetching ? (
            <div className="p-4 text-center text-sm text-secondary-500 flex items-center justify-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-primary-600" /> Đang tìm kiếm...
            </div>
          ) : results?.products && results.products.length > 0 ? (
            <>
              {results.products.map(product => (
                <div
                  key={product._id}
                  onClick={() => goToProduct(product.slug || product._id)}
                  className="p-3 hover:bg-secondary-50 cursor-pointer flex items-center gap-3 border-b border-secondary-100 last:border-b-0"
                >
                  <img
                    src={getSafeImageUrl(product.images?.[0], FALLBACK_IMAGES.product)}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium text-secondary-900 line-clamp-1">{product.name}</div>
                    <div className="text-primary-600 text-sm font-semibold mt-1">
                      {product.price.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>
              ))}
              <div
                onClick={goToResults}
                className="p-3 text-center text-sm text-primary-600 hover:bg-primary-50 cursor-pointer font-medium"
              >
                Xem tất cả kết quả
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-sm text-secondary-500">Không tìm thấy sản phẩm nào</div>
          )}
        </div>
      )}
    </div>
  );
}
