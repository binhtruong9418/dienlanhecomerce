// Filter section: price range presets + manual input
const PRICE_PRESETS = [
  { id: 'under-5', label: 'Dưới 5 triệu', min: 0, max: 5000000 },
  { id: '5-10', label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { id: '10-20', label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { id: '20-30', label: '20 - 30 triệu', min: 20000000, max: 30000000 },
  { id: 'above-30', label: 'Trên 30 triệu', min: 30000000, max: 999999999 },
];

export { PRICE_PRESETS };

interface FilterPriceSectionProps {
  priceRange: { min: string; max: string };
  selectedPreset: string;
  onPresetChange: (presetId: string) => void;
  onInputChange: (type: 'min' | 'max', value: string) => void;
}

export function FilterPriceSection({
  priceRange,
  selectedPreset,
  onPresetChange,
  onInputChange,
}: FilterPriceSectionProps) {
  return (
    <div>
      <h4 className="font-semibold mb-3 text-secondary-900">Khoảng giá</h4>

      <div className="space-y-2 mb-4">
        {PRICE_PRESETS.map(preset => (
          <label
            key={preset.id}
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-secondary-50 cursor-pointer group transition-colors ${
              selectedPreset === preset.id ? 'bg-primary-50' : ''
            }`}
          >
            <input
              type="radio"
              name="pricePreset"
              checked={selectedPreset === preset.id}
              onChange={() => onPresetChange(preset.id)}
              className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
            />
            <span className="flex-1 text-secondary-700 group-hover:text-secondary-900 text-sm">
              {preset.label}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-3">
        <p className="text-sm text-secondary-600 mb-2">Hoặc nhập khoảng giá</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Từ"
            value={priceRange.min}
            onChange={e => onInputChange('min', e.target.value)}
            className="w-1/2 px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            min="0"
          />
          <span className="text-secondary-400">-</span>
          <input
            type="number"
            placeholder="Đến"
            value={priceRange.max}
            onChange={e => onInputChange('max', e.target.value)}
            className="w-1/2 px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
