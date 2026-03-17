import type { User, Product, Category, DashboardStats, SeoData, ContentPage } from '@/types';

export const MOCK_USER: User = {
  id: '1',
  email: 'admin@exoticfruits.com',
  name: 'Admin User',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const MOCK_CREDENTIALS = {
  email: 'admin@exoticfruits.com',
  password: 'admin123',
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Tropical Fruits',
    slug: 'tropical-fruits',
    description: 'Fruits from tropical regions',
    productCount: 12,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Citrus Fruits',
    slug: 'citrus-fruits',
    description: 'Citrus family fruits',
    productCount: 8,
    status: 'active',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-16T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Stone Fruits',
    slug: 'stone-fruits',
    description: 'Fruits with a pit or stone',
    productCount: 6,
    status: 'active',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-17T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Berries',
    slug: 'berries',
    description: 'Small pulpy fruits',
    productCount: 10,
    status: 'inactive',
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-18T00:00:00.000Z',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dragon Fruit',
    slug: 'dragon-fruit',
    description: 'Exotic dragon fruit with vibrant pink flesh',
    price: 8.99,
    salePrice: 6.99,
    stock: 50,
    category: 'Tropical Fruits',
    categoryId: '1',
    images: ['/images/dragon-fruit.jpg'],
    status: 'active',
    featured: true,
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Rambutan',
    slug: 'rambutan',
    description: 'Sweet and juicy rambutan from Southeast Asia',
    price: 12.99,
    stock: 30,
    category: 'Tropical Fruits',
    categoryId: '1',
    images: ['/images/rambutan.jpg'],
    status: 'active',
    featured: false,
    createdAt: '2024-01-11T00:00:00.000Z',
    updatedAt: '2024-01-21T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Blood Orange',
    slug: 'blood-orange',
    description: 'Rich, deep red citrus with sweet flavor',
    price: 4.99,
    stock: 75,
    category: 'Citrus Fruits',
    categoryId: '2',
    images: ['/images/blood-orange.jpg'],
    status: 'active',
    featured: true,
    createdAt: '2024-01-12T00:00:00.000Z',
    updatedAt: '2024-01-22T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Lychee',
    slug: 'lychee',
    description: 'Fragrant and sweet lychee from China',
    price: 9.99,
    stock: 0,
    category: 'Tropical Fruits',
    categoryId: '1',
    images: ['/images/lychee.jpg'],
    status: 'inactive',
    featured: false,
    createdAt: '2024-01-13T00:00:00.000Z',
    updatedAt: '2024-01-23T00:00:00.000Z',
  },
  {
    id: '5',
    name: 'Passion Fruit',
    slug: 'passion-fruit',
    description: 'Tangy passion fruit with intense aroma',
    price: 6.99,
    salePrice: 5.49,
    stock: 45,
    category: 'Tropical Fruits',
    categoryId: '1',
    images: ['/images/passion-fruit.jpg'],
    status: 'active',
    featured: true,
    createdAt: '2024-01-14T00:00:00.000Z',
    updatedAt: '2024-01-24T00:00:00.000Z',
  },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalProducts: MOCK_PRODUCTS.length,
  totalCategories: MOCK_CATEGORIES.length,
  totalOrders: 128,
  totalRevenue: 4892.50,
  recentProducts: MOCK_PRODUCTS.slice(0, 3),
  recentCategories: MOCK_CATEGORIES.slice(0, 3),
};

export const MOCK_SEO_DATA: SeoData[] = [
  {
    id: '1',
    page: 'Home',
    title: 'Exotic Fruits - Fresh Tropical Fruits Delivered',
    description: 'Discover the finest selection of exotic tropical fruits. Fresh, organic, and delivered to your door.',
    keywords: 'exotic fruits, tropical fruits, organic fruits, fresh delivery',
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
  {
    id: '2',
    page: 'Products',
    title: 'Our Exotic Fruits Collection | Exotic Fruits',
    description: 'Browse our wide selection of exotic fruits from around the world.',
    keywords: 'exotic fruits list, buy exotic fruits, tropical fruit shop',
    updatedAt: '2024-01-21T00:00:00.000Z',
  },
];

export const MOCK_CONTENT_PAGES: Record<string, ContentPage> = {
  'privacy-policy': {
    id: '1',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: `# Privacy Policy

Last updated: January 1, 2024

## Introduction

At Exotic Fruits, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share information about you when you use our services.

## Information We Collect

We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

## How We Use Your Information

We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

## Data Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.`,
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
  'terms-conditions': {
    id: '2',
    slug: 'terms-conditions',
    title: 'Terms & Conditions',
    content: `# Terms & Conditions

Last updated: January 1, 2024

## Acceptance of Terms

By accessing and using Exotic Fruits, you accept and agree to be bound by the terms and conditions of this agreement.

## Use License

Permission is granted to temporarily download one copy of the materials on Exotic Fruits\' website for personal, non-commercial transitory viewing only.

## Disclaimer

The materials on Exotic Fruits\' website are provided on an \'as is\' basis. Exotic Fruits makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.`,
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
  'contact-us': {
    id: '3',
    slug: 'contact-us',
    title: 'Contact Us',
    content: `# Contact Us

We\'d love to hear from you! Get in touch with our team using the information below.

## Customer Support

- **Email:** support@exoticfruits.com
- **Phone:** +1 (555) 123-4567
- **Hours:** Monday - Friday, 9am - 6pm EST

## Business Inquiries

- **Email:** business@exoticfruits.com

## Address

123 Fruit Street
Miami, FL 33101
United States`,
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
};
