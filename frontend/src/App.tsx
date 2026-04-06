import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout, useCompatNavigation } from './layouts/MainLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PolicyPage } from './pages/PolicyPage';

// Admin Pages and Layout
import { AdminLayout } from './layouts/AdminLayout';
import { DashboardAdmin } from './pages/admin/DashboardAdmin';
import { ProductsAdmin } from './pages/admin/ProductsAdmin';
import { ProductFormPage } from './pages/admin/ProductFormPage';
import { CategoriesAdmin } from './pages/admin/CategoriesAdmin';
import { CategoryFormPage } from './pages/admin/CategoryFormPage';
import { RequestsAdmin } from './pages/admin/RequestsAdmin';
import { RequestDetailPage } from './pages/admin/RequestDetailPage';
import { SettingsAdmin } from './pages/admin/SettingsAdmin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

// Wrappers needed because pages currently expect props
const ProductsPageWrapper = () => {
  const { handleNavigation, handleProductSelect } = useCompatNavigation();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  return <ProductListPage onNavigate={handleNavigation} onProductSelect={handleProductSelect} categorySlug={categorySlug} />;
};

const ProductDetailWrapper = () => {
  const { handleNavigation } = useCompatNavigation();
  const { slug } = useParams<{ slug: string }>();
  return <ProductDetailPage onNavigate={handleNavigation} productId={slug} />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <Routes>
              {/* Public routes wrapped in Main Layout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPageWrapper />} />
                <Route path="/products/:categorySlug" element={<ProductsPageWrapper />} />
                <Route path="/product/:slug" element={<ProductDetailWrapper />} />
                <Route path="/chinh-sach" element={<PolicyPage />} />
              </Route>

              {/* Admin Routes with React Query and React Router Outlet Component */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardAdmin />} />
                <Route path="products" element={<ProductsAdmin />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/:id/edit" element={<ProductFormPage />} />
                <Route path="categories" element={<CategoriesAdmin />} />
                <Route path="categories/new" element={<CategoryFormPage />} />
                <Route path="categories/:id/edit" element={<CategoryFormPage />} />
                <Route path="requests" element={<RequestsAdmin />} />
                <Route path="requests/:id" element={<RequestDetailPage />} />
                <Route path="settings" element={<SettingsAdmin />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
