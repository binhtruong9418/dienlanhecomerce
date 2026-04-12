// FilterSidebar: desktop sticky sidebar + mobile slide-in drawer
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import productApi from '../api/productApi';
import { FilterCategorySection } from './filter-category-section';
import { FilterPowerSection } from './filter-power-section';
import { FilterPriceSection, PRICE_PRESETS } from './filter-price-section';

interface FilterSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  filters?: any;
  onFilterChange?: (filters: any) => void;
}

export function FilterSidebar({
  isOpen,
  onClose,
  isMobile = false,
  filters = {},
  onFilterChange,
}: FilterSidebarProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedPower, setSelectedPower] = useState<string[]>(filters.power || []);
  const [priceRange, setPriceRange] = useState({ min: filters.priceMin || '', max: filters.priceMax || '' });
  const [selectedPricePreset, setSelectedPricePreset] = useState('');

  // Server-side aggregation replaces the old limit:1000 product fetch
  const { data: filterData, isLoading: loading } = useQuery({
    queryKey: ['productFilters'],
    queryFn: () => productApi.getProductFilters(),
    staleTime: 5 * 60 * 1000,
  });

  const categories = filterData?.categories || [];
  const powerOptions = filterData?.powerOptions || [];

  // Sync local selection state with parent filters
  useEffect(() => {
    if (filters.category && categories.length > 0) {
      const slugs = Array.isArray(filters.category) ? filters.category : [filters.category];
      setSelectedCategoryIds(categories.filter(c => slugs.includes(c.slug)).map(c => c._id));
    } else {
      setSelectedCategoryIds([]);
    }
    setSelectedPower(filters.power || []);
    setPriceRange({ min: filters.priceMin || '', max: filters.priceMax || '' });
  }, [filters, categories]);

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    if (!category) return;

    const newIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter(id => id !== categoryId)
      : [...selectedCategoryIds, categoryId];

    setSelectedCategoryIds(newIds);

    const selectedSlugs = categories.filter(c => newIds.includes(c._id)).map(c => c.slug);
    onFilterChange?.({ ...filters, category: selectedSlugs.length > 0 ? selectedSlugs : undefined });
  };

  const handlePowerChange = (value: string) => {
    const newPower = selectedPower.includes(value)
      ? selectedPower.filter(p => p !== value)
      : [...selectedPower, value];
    setSelectedPower(newPower);
    onFilterChange?.({ ...filters, power: newPower.length > 0 ? newPower : undefined });
  };

  const handlePricePresetChange = (presetId: string) => {
    const preset = PRICE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedPricePreset(presetId);
    const newRange = { min: preset.min.toString(), max: preset.max === 999999999 ? '' : preset.max.toString() };
    setPriceRange(newRange);
    onFilterChange?.({ ...filters, priceMin: preset.min, priceMax: preset.max === 999999999 ? undefined : preset.max });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min: min.toString(), max: max.toString() });
    setSelectedPricePreset('');
    onFilterChange?.({
      ...filters,
      priceMin: min > 0 ? min : undefined,
      priceMax: max,
    });
  };

  const handleReset = () => {
    setSelectedCategoryIds([]);
    setSelectedPower([]);
    setPriceRange({ min: '', max: '' });
    setSelectedPricePreset('');
    onFilterChange?.({ category: undefined, power: undefined, priceMin: undefined, priceMax: undefined });
  };

  const content = (
    <div className="bg-white h-full overflow-y-auto">
      {isMobile && (
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-4 flex items-center justify-between z-10">
          <h3 className="font-semibold text-lg text-secondary-900">Bộ lọc</h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-secondary-600" />
          </button>
        </div>
      )}

      <div className="p-4 space-y-6">
        {loading && <div className="text-center py-4 text-secondary-600">Đang tải dữ liệu...</div>}

        {categories.length > 0 && (
          <>
            <FilterCategorySection categories={categories} selectedIds={selectedCategoryIds} onChange={handleCategoryChange} />
            <div className="border-t border-secondary-200" />
          </>
        )}

        {powerOptions.length > 0 && (
          <>
            <FilterPowerSection powerOptions={powerOptions} selectedPower={selectedPower} onChange={handlePowerChange} />
            <div className="border-t border-secondary-200" />
          </>
        )}

        <FilterPriceSection
          priceRange={priceRange}
          selectedPreset={selectedPricePreset}
          onPresetChange={handlePricePresetChange}
          onRangeChange={handlePriceRangeChange}
        />

        <div className="pt-4 space-y-3">
          <button onClick={handleReset} className="w-full border-2 border-secondary-300 text-secondary-700 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition-colors">
            Xóa bộ lọc
          </button>
          {isMobile && (
            <button onClick={onClose} className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Áp dụng
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
        <div className={`fixed top-0 left-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {content}
        </div>
      </>
    );
  }

  return (
    <div className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-20 bg-white border border-secondary-200 rounded-xl overflow-hidden shadow-sm">
        {content}
      </div>
    </div>
  );
}
