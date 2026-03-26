import { ShoppingCart, Search, Menu, Phone, Mail, X } from 'lucide-react';
import { useState } from 'react';

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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
            <div className="bg-white shadow-sm text-white p-2 rounded-lg">
              <img 
                src="https://res.cloudinary.com/dhiczfj7e/image/upload/v1774328232/LOGO-QHN_h3xglw.png" 
                alt="Logo" 
                className="w-6 h-6 object-contain"
              />
              {/* <img className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" src="https://res.cloudinary.com/dhiczfj7e/image/upload/v1774328232/LOGO-QHN_h3xglw.png" alt="" /> */}
            </div>
            <div>
              <div className="font-bold text-xl text-primary-700">PK Quạt hơi nước</div>
              <div className="text-xs text-secondary-500 hidden sm:block">Giải pháp điện lạnh chuyên nghiệp</div>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex gap-8 items-center">
            <a href="#" onClick={handleHomeClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
              Trang chủ
            </a>
            <a href="#products" onClick={handleProductsClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
              Sản phẩm
            </a>
            <a href="#quote" onClick={handleQuoteClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
              Yêu cầu báo giá
            </a>
            
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                className="w-64 pl-10 pr-4 py-2 rounded-lg border border-secondary-200 text-secondary-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
          </nav>

          {/* Hotline - Highlighted */}
          <div className="hidden md:flex items-center gap-3 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
            <Phone className="w-5 h-5" />
            <div>
              <div className="text-xs opacity-90">Hotline tư vấn</div>
              <div className="font-bold text-lg">1900 xxxx</div>
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-secondary-200 bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#" onClick={handleHomeClick} className="text-secondary-700 hover:text-primary-600 font-medium transition-colors py-2">
              Trang chủ
            </a>
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
                <div className="font-bold">1900 xxxx</div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}