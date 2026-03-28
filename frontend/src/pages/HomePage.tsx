import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { Benefits } from '../components/Benefits';
import { QuoteSection } from '../components/QuoteSection';
import { useCompatNavigation } from '../layouts/MainLayout';

export const HomePage = () => {
  const { handleNavigation, handleProductSelect } = useCompatNavigation();
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedProducts onNavigate={handleNavigation} onProductSelect={handleProductSelect} />
      <Benefits />
      <QuoteSection />
    </main>
  );
};
