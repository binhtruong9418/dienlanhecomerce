export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  } | string;
  brand: string;
  productModel: string;
  power: string;
  capacity: string;
  area: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  specifications: Array<{
    label: string;
    value: string;
    _id?: string;
  }>;
  features: Array<{
    icon: string;
    title: string;
    description: string;
    _id?: string;
  }>;
  inStock: boolean;
  stock: number;
  status: 'active' | 'inactive' | 'deleted';
  views: number;
  fieldVisibility?: {
    brand: boolean;
    model: boolean;
    power: boolean;
    capacity: boolean;
    area: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  power?: string[];
  priceMin?: number;
  priceMax?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}