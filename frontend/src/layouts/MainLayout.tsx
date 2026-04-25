import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Scrolls to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Product } from '../types/product';
import { useSettings } from '../hooks/useSettings';
import { getSafeImageUrl } from '../utils/imageUtils';

// Helper hook for backward-compatible navigation
export function useCompatNavigation() {
  const navigate = useNavigate();
  return {
    handleNavigation: (
      page: 'home' | 'products' | 'product-detail' | 'quote-request' | 'admin',
      productName?: string,
      productId?: string
    ) => {
      window.scrollTo(0, 0);
      switch (page) {
        case 'home': navigate('/'); break;
        case 'products': navigate('/products'); break;
        case 'product-detail': 
          if (productName) navigate(`/product/${productName}`);
          else if (productId) navigate(`/product/${productId}`);
          else navigate('/products');
          break;
        case 'quote-request':
          navigate('/quote', { state: { productName, productId } });
          break;
        case 'admin': navigate('/admin'); break;
        default: navigate('/');
      }
    },
    handleProductSelect: (product: Product) => {
      const urlParam = product.slug || product.name || product._id;
      navigate(`/product/${urlParam}`);
      window.scrollTo(0, 0);
    }
  };
}

export const MainLayout = () => {
  const { handleNavigation } = useCompatNavigation();
  const { companyInfo } = useSettings();

  useEffect(() => {
    if (!companyInfo) return;

    document.title = companyInfo.siteTitle || companyInfo.companyName || '';

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', companyInfo.siteDescription || companyInfo.companyName || '');

    if (companyInfo.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = companyInfo.faviconUrl;
    }
  }, [companyInfo]);

  return (
    <>
      <ScrollToTop />
      <Header onNavigate={handleNavigation} />
      <Outlet />
      <Footer onNavigate={handleNavigation} />
    </>
  );
};
