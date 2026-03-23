export interface QuoteRequest {
  _id: string;
  customerName: string;
  phone: string;
  email: string;
  company?: string;
  address?: string;
  businessType?: string;
  product: string;
  productId?: string;
  quantity: number;
  notes?: string;
  files?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  status: 'pending' | 'quoted' | 'completed' | 'cancelled';
  quotedPrice?: number;
  quotedBy?: string;
  quotedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  date?: string; // For display
}

export interface QuoteRequestFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface QuoteRequestsResponse {
  success: boolean;
  requests: QuoteRequest[];
  total: number;
  page: number;
  totalPages: number;
}