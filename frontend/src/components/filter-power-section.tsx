// Filter section: power checkboxes with product counts
interface PowerOption {
  value: string;
  label: string;
  count: number;
}

interface FilterPowerSectionProps {
  powerOptions: PowerOption[];
  selectedPower: string[];
  onChange: (value: string) => void;
}

export function FilterPowerSection({ powerOptions, selectedPower, onChange }: FilterPowerSectionProps) {
  if (powerOptions.length === 0) return null;

  return (
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
              onChange={() => onChange(power.value)}
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
  );
}
