// Filter section: price range presets + dual-thumb slider (react-slider)
import ReactSlider from 'react-slider';

const PRICE_PRESETS = [
  { id: 'under-5', label: 'Dưới 5 triệu', min: 0, max: 5000000 },
  { id: '5-10', label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { id: '10-20', label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { id: '20-30', label: '20 - 30 triệu', min: 20000000, max: 30000000 },
  { id: 'above-30', label: 'Trên 30 triệu', min: 30000000, max: 999999999 },
];

export { PRICE_PRESETS };

const SLIDER_MIN = 0;
const SLIDER_MAX = 50000000;
const SLIDER_STEP = 500000;

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value) + 'đ';

interface FilterPriceSectionProps {
  priceRange: { min: string; max: string };
  selectedPreset: string;
  onPresetChange: (presetId: string) => void;
  onRangeChange: (min: number, max: number) => void;
}

export function FilterPriceSection({
  priceRange,
  selectedPreset,
  onPresetChange,
  onRangeChange,
}: FilterPriceSectionProps) {
  const minValue = priceRange.min ? Math.min(Number(priceRange.min), SLIDER_MAX) : SLIDER_MIN;
  const maxRaw = priceRange.max ? Number(priceRange.max) : SLIDER_MAX;
  const maxValue = Math.min(maxRaw, SLIDER_MAX);

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

      <div className="mt-4">
        <p className="text-sm text-secondary-600 mb-3">Hoặc chọn khoảng giá</p>
        <ReactSlider
          className="price-slider"
          thumbClassName="price-slider-thumb"
          trackClassName="price-slider-track"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={SLIDER_STEP}
          value={[minValue, maxValue]}
          onChange={([min, max]) => onRangeChange(min, max)}
          pearling
          minDistance={SLIDER_STEP}
          ariaLabel={['Giá tối thiểu', 'Giá tối đa']}
        />
        <div className="flex justify-between text-sm text-secondary-700 font-medium mt-3">
          <span>{formatVnd(minValue)}</span>
          <span>{formatVnd(maxValue)}</span>
        </div>
      </div>
    </div>
  );
}
