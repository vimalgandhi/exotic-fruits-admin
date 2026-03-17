export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ProductSeo {
  metaTitle?: string;
  metaDescription?: string;
  index?: boolean;
  follow?: boolean;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaJson?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: string;
  categoryId: string;
  originCountry?: string;
  stockStatus?: 'In Stock' | 'Out of Stock';
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  seo?: ProductSeo;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  recentProducts: Product[];
  recentCategories: Category[];
}

export interface SeoData {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  updatedAt: string;
}

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

export interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  maxSize?: number;
  accept?: string;
  preview?: boolean;
  crop?: boolean;
}

export interface HtmlEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  theme?: string;
}
