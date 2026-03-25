import type { SeoData, ContentPage } from '@/types';

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
