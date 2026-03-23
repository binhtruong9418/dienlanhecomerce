import { useState, useEffect, React } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Benefits } from './components/Benefits';
import { QuoteSection } from './components/QuoteSection';
import { Footer } from './components/Footer';
import { ProductListPage } from './components/ProductListPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { QuoteRequestPage } from './components/QuoteRequestPage';
import { AdminPage } from './components/AdminPage';
import { AuthProvider } from './contexts/AuthContext';
import { Product } from './types/product';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'product-detail' | 'quote-request' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleNavigation = (
    page: 'home' | 'products' | 'product-detail' | 'quote-request' | 'admin',
    productName?: string,
    productId?: string
  ) => {
    setCurrentPage(page);
    if (productName) {
      setSelectedProduct(productName);
    }
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo(0, 0);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product.name);
    setSelectedProductId(product._id);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen">
        {currentPage === 'home' && (
          <>
            <Header onNavigate={handleNavigation} />
            <main>
              <Hero />
              <Categories onNavigate={handleNavigation} />
              <FeaturedProducts onNavigate={handleNavigation} onProductSelect={handleProductSelect} />
              <Benefits />
              <QuoteSection />
            </main>
            <Footer onNavigate={handleNavigation} />
          </>
        )}
        
        {currentPage === 'products' && (
          <>
            <Header onNavigate={handleNavigation} />
            <ProductListPage 
              onNavigate={handleNavigation} 
              onProductSelect={handleProductSelect}
            />
            <Footer onNavigate={handleNavigation} />
          </>
        )}

        {currentPage === 'product-detail' && (
          <>
            <Header onNavigate={handleNavigation} />
            <ProductDetailPage 
              onNavigate={handleNavigation} 
              productId={selectedProductId}
            />
            <Footer onNavigate={handleNavigation} />
          </>
        )}

        {currentPage === 'admin' && (
          <AdminPage onNavigate={handleNavigation} />
        )}
      </div>
    </AuthProvider>
  );
}