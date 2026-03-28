import { Search, Menu, Phone, X, Loader } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import productApi from '../api/productApi';
import { useDebounce } from '../hooks/useDebounce';
import { useSettings } from '../hooks/useSettings';
import { getSafeImageUrl, FALLBACK_IMAGES } from '../utils/imageUtils';

interface HeaderProps {
  onNavigate?: (page: 'home' | 'products' | 'product-detail' | 'quote-request') => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.('products');
    setMobileMenuOpen(false);
  };
  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.('home'); // về trang home

    // delay để đảm bảo DOM render xong rồi mới scroll
    setTimeout(() => {
      const el = document.getElementById('quote');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    setMobileMenuOpen(false);
  };
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.('home');
    setMobileMenuOpen(false);
  };

  const navigate = useNavigate();
  const { companyInfo } = useSettings();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearch = useDebounce(searchKeyword, 500);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isFetching } = useQuery({
    queryKey: ['searchProducts', debouncedSearch],
    queryFn: () => productApi.getProducts({ search: debouncedSearch, limit: 5 }),
    enabled: debouncedSearch.length > 0,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchKeyword.trim()) {
      setShowDropdown(false);
      navigate(`/products?q=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
            <div className="bg-white shadow-sm text-white p-2 rounded-lg">
              <img 
                src={getSafeImageUrl('', 'https://res.cloudinary.com/dhiczfj7e/image/upload/v1774328232/LOGO-QHN_h3xglw.png')} 
                alt={companyInfo?.companyName || "Logo"} 
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-xl text-primary-700">{companyInfo?.companyName || 'PK Quạt hơi nước'}</div>
              <div className="text-xs text-secondary-500 hidden sm:block">Giải pháp điện lạnh chuyên nghiệp</div>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex gap-8 items-center">
            <a href="#products" onClick={handleProductsClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
              Sản phẩm
            </a>
            <a href="#quote" onClick={handleQuoteClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
              Yêu cầu báo giá
            </a>
            
            {/* Search Box */}
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setShowDropdown(true);
                }}
                onKeyDown={handleSearchSubmit}
                onFocus={() => setShowDropdown(true)}
                className="w-64 xl:w-80 pl-10 pr-4 py-2 rounded-lg border border-secondary-200 text-secondary-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              
              {/* Search Dropdown Desktop */}
              {showDropdown && searchKeyword.trim().length > 0 && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-lg shadow-xl border border-secondary-200 overflow-hidden z-50">
                  {isFetching ? (
                    <div className="p-4 text-center text-sm text-secondary-500 flex items-center justify-center gap-2">
                       <Loader className="w-4 h-4 animate-spin text-primary-600" /> Đang tìm kiếm...
                    </div>
                  ) : searchResults?.products && searchResults.products.length > 0 ? (
                    <div>
                      {searchResults.products.map(product => (
                        <div 
                          key={product._id} 
                          className="p-3 hover:bg-secondary-50 cursor-pointer flex items-center gap-3 border-b border-secondary-100 last:border-b-0"
                          onClick={() => {
                            setShowDropdown(false);
                            navigate(`/product/${product.slug || product._id}`);
                          }}
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
                        className="p-3 text-center text-sm text-primary-600 hover:bg-primary-50 cursor-pointer font-medium"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate(`/products?q=${encodeURIComponent(searchKeyword.trim())}`);
                        }}
                      >
                        Xem tất cả kết quả
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-secondary-500">
                      Không tìm thấy sản phẩm nào
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Hotline - Highlighted */}
          <div className="hidden md:flex items-center gap-3 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
            <Phone className="w-5 h-5" />
            <div>
              <div className="text-xs opacity-90">Hotline tư vấn</div>
              <div className="font-bold text-lg">{companyInfo?.phone || '1900 xxxx'}</div>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu & search layer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-secondary-200 bg-white shadow-lg pb-4">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#products" onClick={handleProductsClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors py-2">
              Sản phẩm
            </a>
            <a href="#quote" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors py-2">
              Yêu cầu báo giá
            </a>
            {/* Mobile Hotline */}
            <div className="flex items-center gap-3 bg-primary-600 text-white px-4 py-3 rounded-lg mt-2">
              <Phone className="w-5 h-5" />
              <div>
                <div className="text-xs opacity-90">Hotline</div>
                <div className="font-bold">{companyInfo?.phone || '1900 xxxx'}</div>
              </div>
            </div>

            {/* Mobile Search Box */}
            <div className="relative mt-2" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setShowDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setMobileMenuOpen(false);
                    handleSearchSubmit(e);
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-secondary-200 text-secondary-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              
              {/* Mobile Search Dropdown */}
              {showDropdown && searchKeyword.trim().length > 0 && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-lg shadow-xl border border-secondary-200 overflow-hidden z-50">
                  {isFetching ? (
                    <div className="p-4 text-center text-sm text-secondary-500 flex items-center justify-center gap-2">
                       <Loader className="w-4 h-4 animate-spin text-primary-600" /> Đang tìm kiếm...
                    </div>
                  ) : searchResults?.products && searchResults.products.length > 0 ? (
                    <div>
                      {searchResults.products.map(product => (
                        <div 
                          key={product._id} 
                          className="p-3 hover:bg-secondary-50 cursor-pointer flex items-center gap-3 border-b border-secondary-100 last:border-b-0"
                          onClick={() => {
                            setShowDropdown(false);
                            setMobileMenuOpen(false);
                            navigate(`/product/${product.slug || product._id}`);
                          }}
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
                        className="p-3 text-center text-sm text-primary-600 hover:bg-primary-50 cursor-pointer font-medium"
                        onClick={() => {
                          setShowDropdown(false);
                          setMobileMenuOpen(false);
                          navigate(`/products?q=${encodeURIComponent(searchKeyword.trim())}`);
                        }}
                      >
                        Xem tất cả kết quả
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-secondary-500">
                      Không tìm thấy sản phẩm nào
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}