// Filter section: category checkboxes with product counts
interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
  count: number;
}

interface FilterCategorySectionProps {
  categories: CategoryOption[];
  selectedIds: string[];
  onChange: (categoryId: string) => void;
}

export function FilterCategorySection({ categories, selectedIds, onChange }: FilterCategorySectionProps) {
  if (categories.length === 0) return null;

  return (
    <div>
      <h4 className="font-semibold mb-3 text-secondary-900">Danh mục sản phẩm</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {categories.map(category => (
          <label
            key={category._id}
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-secondary-50 cursor-pointer group transition-colors ${
              selectedIds.includes(category._id) ? 'bg-primary-50' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(category._id)}
              onChange={() => onChange(category._id)}
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
  );
}
