import { ProductCard } from './ProductCard';
import { Filter, ChevronDown } from 'lucide-react';

export function ProductGrid() {
  const products = [
    {
      name: 'Điều hòa cây Daikin FVRN100BXV1V - Inverter 4.0HP',
      image: 'https://images.unsplash.com/photo-1762341123870-d706f257a12e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhaXIlMjBjb25kaXRpb25lciUyMHVuaXR8ZW58MXx8fHwxNzY4MzU5ODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 28900000,
      originalPrice: 35000000,
      cooling: '34.400 BTU',
      power: '4.0 HP',
      area: '40-50 m²',
      rating: 4.8,
      reviews: 124,
      badge: 'Bán chạy',
    },
    {
      name: 'Điều hòa cây LG APNQ36GR5A4 - Inverter 4.0HP',
      image: 'https://images.unsplash.com/photo-1715593949273-09009558300a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBhaXIlMjBjb25kaXRpb25pbmd8ZW58MXx8fHwxNzY4MzU5ODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 26500000,
      originalPrice: 32000000,
      cooling: '36.000 BTU',
      power: '4.0 HP',
      area: '40-55 m²',
      rating: 4.7,
      reviews: 98,
    },
    {
      name: 'Quạt điều hòa Sunhouse SHD7720 - 45L',
      image: 'https://images.unsplash.com/photo-1662079041625-619ef2787a4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0YWJsZSUyMGFpciUyMGNvb2xlcnxlbnwxfHx8fDE3NjgzNTk4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 3890000,
      originalPrice: 4500000,
      cooling: '180 W',
      power: '180 W',
      area: '15-25 m²',
      rating: 4.5,
      reviews: 256,
      badge: 'Mới',
    },
    {
      name: 'Điều hòa cây Mitsubishi Heavy FDF100VD1 - 4.0HP',
      image: 'https://images.unsplash.com/photo-1754821480165-cee2f744fe4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29saW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjgzNTk4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 29900000,
      cooling: '35.000 BTU',
      power: '4.0 HP',
      area: '40-50 m²',
      rating: 4.9,
      reviews: 87,
    },
    {
      name: 'Quạt điều hòa Kangaroo KG50F68 - 70L',
      image: 'https://images.unsplash.com/photo-1662079041625-619ef2787a4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0YWJsZSUyMGFpciUyMGNvb2xlcnxlbnwxfHx8fDE3NjgzNTk4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 5490000,
      originalPrice: 6200000,
      cooling: '250 W',
      power: '250 W',
      area: '25-35 m²',
      rating: 4.6,
      reviews: 178,
    },
    {
      name: 'Điều hòa cây Panasonic CS-C28FFH - Inverter 3.0HP',
      image: 'https://images.unsplash.com/photo-1762341123870-d706f257a12e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhaXIlMjBjb25kaXRpb25lciUyMHVuaXR8ZW58MXx8fHwxNzY4MzU5ODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 24900000,
      originalPrice: 29000000,
      cooling: '28.000 BTU',
      power: '3.0 HP',
      area: '30-40 m²',
      rating: 4.7,
      reviews: 145,
      badge: 'Tiết kiệm điện',
    },
    {
      name: 'Quạt điều hòa Honeywell CO30XE - Thương hiệu Mỹ',
      image: 'https://images.unsplash.com/photo-1662079041625-619ef2787a4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0YWJsZSUyMGFpciUyMGNvb2xlcnxlbnwxfHx8fDE3NjgzNTk4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 6990000,
      cooling: '320 W',
      power: '320 W',
      area: '30-40 m²',
      rating: 4.8,
      reviews: 92,
      badge: 'Cao cấp',
    },
    {
      name: 'Điều hòa cây Samsung AF24A7774MZ1SV - Inverter 2.5HP',
      image: 'https://images.unsplash.com/photo-1715593949273-09009558300a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBhaXIlMjBjb25kaXRpb25pbmd8ZW58MXx8fHwxNzY4MzU5ODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 21900000,
      originalPrice: 25500000,
      cooling: '24.000 BTU',
      power: '2.5 HP',
      area: '25-35 m²',
      rating: 4.6,
      reviews: 167,
    },
  ];

  return (
    <section id="products" className="py-16 bg-secondary-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="mb-2">Sản phẩm nổi bật</h2>
            <p className="text-secondary-600">
              Tuyển chọn các sản phẩm chất lượng cao, giá cạnh tranh
            </p>
          </div>

          {/* Filters - Desktop */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 rounded-lg hover:border-primary-500 transition-colors">
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 rounded-lg hover:border-primary-500 transition-colors">
              Thương hiệu
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 rounded-lg hover:border-primary-500 transition-colors">
              Giá
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 rounded-lg hover:border-primary-500 transition-colors">
              Công suất
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors">
            Xem thêm sản phẩm
          </button>
        </div>
      </div>
    </section>
  );
}
