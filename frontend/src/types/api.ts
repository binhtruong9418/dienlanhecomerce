export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;

  // Cấu trúc tùy thuộc backend trả về
  product?: T;
  products?: T[];
  category?: T;
  categories?: T[];
  requests?: T[];

  // Phân trang
  total?: number;
  page?: number;
  totalPages?: number;
}
