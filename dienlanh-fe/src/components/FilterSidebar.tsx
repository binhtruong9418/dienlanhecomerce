// FilterSidebar.tsx
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import productApi from '../api/productApi';
import categoryApi from '../api/categoryApi';
import { Category } from '../types/category';

interface FilterSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  filters?: any;
  onFilterChange?: (filters: any) => void;
}

interface CategoryWithCount extends Category {
  count: number;
}

interface PowerOption {
  value: string;
  label: string;
  count: number;
}

export function FilterSidebar({ 
  isOpen, 
  onClose, 
  isMobile = false,
  filters = {},
  onFilterChange 
}: FilterSidebarProps) {
  
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [powerOptions, setPowerOptions] = useState<PowerOption[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State lưu ID được chọn (để hiển thị checkbox)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedPower, setSelectedPower] = useState<string[]>(filters.power || []);
  const [priceRange, setPriceRange] = useState<{min: string; max: string}>({
    min: filters.priceMin || '',
    max: filters.priceMax || ''
  });
  const [selectedPricePreset, setSelectedPricePreset] = useState<string>('');

  const pricePresets = [
    { id: 'under-5', label: 'Dưới 5 triệu', min: 0, max: 5000000 },
    { id: '5-10', label: '5 - 10 triệu', min: 5000000, max: 10000000 },
    { id: '10-20', label: '10 - 20 triệu', min: 10000000, max: 20000000 },
    { id: '20-30', label: '20 - 30 triệu', min: 20000000, max: 30000000 },
    { id: 'above-30', label: 'Trên 30 triệu', min: 30000000, max: 999999999 },
  ];

  // Fetch categories và tính số lượng sản phẩm
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesData = await categoryApi.getCategories();
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || [];
        
        // Fetch tất cả sản phẩm để đếm
        const productsResponse = await productApi.getProducts({ limit: 1000 });
        const products = productsResponse.products || [];
        
        // Tính số lượng sản phẩm cho mỗi category
        const categoriesWithCount = categoriesArray.map((cat: Category) => {
          const count = products.filter(p => {
            if (typeof p.category === 'object') {
              return p.category._id === cat._id || p.category.slug === cat.slug;
            }
            return p.category === cat._id || p.category === cat.slug;
          }).length;
          
          return {
            ...cat,
            count
          };
        });
        
        setCategories(categoriesWithCount);
        
        // Tính số lượng cho mỗi công suất
        const powerMap = new Map<string, number>();
        products.forEach(p => {
          if (p.power) {
            const power = p.power;
            powerMap.set(power, (powerMap.get(power) || 0) + 1);
          }
        });
        
        const powerArray: PowerOption[] = Array.from(powerMap.entries())
          .map(([value, count]) => ({
            value,
            label: value,
            count
          }))
          .sort((a, b) => {
            const aNum = parseFloat(a.value);
            const bNum = parseFloat(b.value);
            return aNum - bNum;
          });
        
        setPowerOptions(powerArray);
        
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilterData();
  }, []);

  // Đồng bộ selected categories với filters từ parent
  useEffect(() => {
    if (filters.category) {
      // Nếu filters.category là array slugs, tìm các category có slug tương ứng
      const categorySlugs = Array.isArray(filters.category) ? filters.category : [filters.category];
      const matchedIds = categories
        .filter(cat => categorySlugs.includes(cat.slug))
        .map(cat => cat._id);
      setSelectedCategoryIds(matchedIds);
    } else {
      setSelectedCategoryIds([]);
    }
    
    setSelectedPower(filters.power || []);
    setPriceRange({
      min: filters.priceMin || '',
      max: filters.priceMax || ''
    });
  }, [filters, categories]);

  const handleCategoryChange = (categoryId: string) => {
    // Tìm category object để lấy slug
    const selectedCategory = categories.find(c => c._id === categoryId);
    if (!selectedCategory) return;
    
    // Cập nhật selected IDs (để hiển thị checkbox)
    const newSelectedIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter(id => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    
    setSelectedCategoryIds(newSelectedIds);
    
    // Lấy danh sách slugs từ các category được chọn
    const selectedSlugs = categories
      .filter(c => newSelectedIds.includes(c._id))
      .map(c => c.slug);
    
    console.log('Selected slugs:', selectedSlugs);
    console.log('Selected IDs for display:', newSelectedIds);
    
    // Gửi slugs lên parent
    onFilterChange?.({ 
      ...filters, 
      category: selectedSlugs.length > 0 ? selectedSlugs : undefined
    });
  };

  const handlePowerChange = (powerValue: string) => {
    const newPower = selectedPower.includes(powerValue)
      ? selectedPower.filter(p => p !== powerValue)
      : [...selectedPower, powerValue];
    
    setSelectedPower(newPower);
    onFilterChange?.({ 
      ...filters, 
      power: newPower.length > 0 ? newPower : undefined 
    });
  };

  const handlePricePresetChange = (presetId: string) => {
    setSelectedPricePreset(presetId);
    const preset = pricePresets.find(p => p.id === presetId);
    if (preset) {
      const newPriceRange = { 
        min: preset.min.toString(), 
        max: preset.max === 999999999 ? '' : preset.max.toString() 
      };
      setPriceRange(newPriceRange);
      onFilterChange?.({ 
        ...filters, 
        priceMin: preset.min, 
        priceMax: preset.max === 999999999 ? undefined : preset.max 
      });
    }
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    const newPriceRange = { ...priceRange, [type]: value };
    setPriceRange(newPriceRange);
    setSelectedPricePreset(''); // Bỏ chọn preset khi nhập tay
    
    onFilterChange?.({ 
      ...filters, 
      priceMin: type === 'min' ? (value || undefined) : (priceRange.min || undefined),
      priceMax: type === 'max' ? (value || undefined) : (priceRange.max || undefined)
    });
  };

  const handleReset = () => {
    setSelectedCategoryIds([]);
    setSelectedPower([]);
    setPriceRange({ min: '', max: '' });
    setSelectedPricePreset('');
    
    // Gửi filter rỗng lên parent (xóa hết filter)
    onFilterChange?.({ 
      category: undefined, 
      power: undefined, 
      priceMin: undefined, 
      priceMax: undefined 
    });
  };

  const content = (
    <div className="bg-white h-full overflow-y-auto">
      {/* Header - Mobile only */}
      {isMobile && (
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-4 flex items-center justify-between z-10">
          <h3 className="font-semibold text-lg text-secondary-900">Bộ lọc</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary-600" />
          </button>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-4 text-secondary-600">
            Đang tải dữ liệu...
          </div>
        )}

        {/* Categories Filter */}
        {categories.length > 0 && (
          <>
            <div>
              <h4 className="font-semibold mb-3 text-secondary-900">Danh mục sản phẩm</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {categories.map(category => (
                  <label
                    key={category._id}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-secondary-50 cursor-pointer group transition-colors ${
                      selectedCategoryIds.includes(category._id) ? 'bg-primary-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                      className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <span className="flex-1 text-secondary-700 group-hover:text-secondary-900 text-sm">
                      {category.name}
                    </span>
                    <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="border-t border-secondary-200"></div>
          </>
        )}

        {/* Power Filter */}
        {powerOptions.length > 0 && (
          <>
            <div>
              <h4 className="font-semibold mb-3 text-secondary-900">Công suất</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {powerOptions.map(power => (
                  <label
                    key={power.value}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-secondary-50 cursor-pointer group transition-colors ${
                      selectedPower.includes(power.value) ? 'bg-primary-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPower.includes(power.value)}
                      onChange={() => handlePowerChange(power.value)}
                      className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <span className="flex-1 text-secondary-700 group-hover:text-secondary-900 text-sm">
                      {power.label}
                    </span>
                    <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded-full">
                      {power.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="border-t border-secondary-200"></div>
          </>
        )}

        {/* Price Range Filter */}
        <div>
          <h4 className="font-semibold mb-3 text-secondary-900">Khoảng giá</h4>
          
          {/* Price Presets */}
          <div className="space-y-2 mb-4">
            {pricePresets.map(preset => (
              <label
                key={preset.id}
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-secondary-50 cursor-pointer group transition-colors ${
                  selectedPricePreset === preset.id ? 'bg-primary-50' : ''
                }`}
              >
                <input
                  type="radio"
                  name="pricePreset"
                  checked={selectedPricePreset === preset.id}
                  onChange={() => handlePricePresetChange(preset.id)}
                  className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                />
                <span className="flex-1 text-secondary-700 group-hover:text-secondary-900 text-sm">
                  {preset.label}
                </span>
              </label>
            ))}
          </div>

          {/* Custom Price Input */}
          <div className="mt-3">
            <p className="text-sm text-secondary-600 mb-2">Hoặc nhập khoảng giá</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={priceRange.min}
                onChange={(e) => handlePriceInputChange('min', e.target.value)}
                className="w-1/2 px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                min="0"
              />
              <span className="text-secondary-400">-</span>
              <input
                type="number"
                placeholder="Đến"
                value={priceRange.max}
                onChange={(e) => handlePriceInputChange('max', e.target.value)}
                className="w-1/2 px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            onClick={handleReset}
            className="w-full border-2 border-secondary-300 text-secondary-700 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition-colors"
          >
            Xóa bộ lọc
          </button>

          {/* Apply Button - Mobile only */}
          {isMobile && (
            <button
              onClick={onClose}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Áp dụng
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {content}
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-20 bg-white border border-secondary-200 rounded-xl overflow-hidden shadow-sm">
        {content}
      </div>
    </div>
  );
}