export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  parentId?: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
