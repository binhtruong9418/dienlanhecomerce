import { Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { getSafeImageUrl } from '../utils/imageUtils';
import { HeaderSearchBox } from './header-search-box';

interface HeaderProps {
  onNavigate?: (page: 'home' | 'products' | 'product-detail' | 'quote-request') => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { companyInfo } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.('home');
    setMobileMenuOpen(false);
  };

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.('products');
    setMobileMenuOpen(false);
  };

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (isHomePage) {
      document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/quote');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
            <div className="bg-white shadow-sm text-white p-2 rounded-lg">
              <img
                src={getSafeImageUrl('', 'https://res.cloudinary.com/dhiczfj7e/image/upload/v1774328232/LOGO-QHN_h3xglw.png')}
                alt={companyInfo?.companyName || 'Logo'}
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-xl text-primary-700">{companyInfo?.companyName || 'PK Quạt hơi nước'}</div>
              <div className="text-xs text-secondary-500 hidden sm:block">Giải pháp điện lạnh chuyên nghiệp</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex gap-8 items-center">
            <a href="#products" onClick={handleProductsClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
              Sản phẩm
            </a>
            <a href="" onClick={handleQuoteClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
              Yêu cầu báo giá
            </a>
            <HeaderSearchBox className="w-64 xl:w-80" inputClassName="w-full" />
          </nav>

          {/* Hotline */}
          <div className="hidden md:flex items-center gap-3 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
            <Phone className="w-5 h-5" />
            <div>
              <div className="text-xs opacity-90">Hotline tư vấn</div>
              <div className="font-bold text-lg">{companyInfo?.phone || '1900 xxxx'}</div>
            </div>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-secondary-200 bg-white shadow-lg pb-4">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#products" onClick={handleProductsClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors py-2">
              Sản phẩm
            </a>
            <a href="/quote" onClick={handleQuoteClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors py-2">
              Yêu cầu báo giá
            </a>
            <div className="flex items-center gap-3 bg-primary-600 text-white px-4 py-3 rounded-lg mt-2">
              <Phone className="w-5 h-5" />
              <div>
                <div className="text-xs opacity-90">Hotline</div>
                <div className="font-bold">{companyInfo?.phone || '1900 xxxx'}</div>
              </div>
            </div>
            <HeaderSearchBox className="mt-2" inputClassName="w-full py-3" onSelect={() => setMobileMenuOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}