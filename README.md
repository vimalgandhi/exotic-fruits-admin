# Exotic Fruits Admin Panel

A modern admin panel for the Exotic Fruits e-commerce platform built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Secure login with cookie-based token management
- **Dashboard**: Overview of key metrics (products, categories, orders, revenue)
- **Products Management**: List, search, and manage products
- **Categories Management**: Organize products into categories
- **SEO Management**: Edit meta titles, descriptions, and keywords for pages
- **Content Pages**: Edit Privacy Policy, Terms & Conditions, and Contact Us pages
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16.1.7 (App Router)
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: Zustand 4.5.1
- **Form Handling**: React Hook Form 7.51.0 + Zod 3.22.4
- **HTTP Client**: Axios 1.6.7
- **Notifications**: Sonner 1.3.1
- **Icons**: Lucide React 0.344.0

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Exotic Fruits Admin
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Demo Login

- **Email**: admin@exoticfruits.com
- **Password**: admin123

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/login/       # Login page
│   ├── (protected)/        # Protected route group
│   │   ├── dashboard/      # Dashboard page
│   │   ├── products/       # Products management
│   │   ├── categories/     # Categories management
│   │   ├── seo/            # SEO management
│   │   ├── privacy-policy/ # Privacy policy editor
│   │   ├── terms-conditions/ # Terms editor
│   │   └── contact-us/     # Contact us editor
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/             # Sidebar, Header
│   └── ui/                 # Button, Input, Modal, Table
├── hooks/                  # useProducts, useCategories
├── lib/                    # api, auth, mock-data, utils
├── store/                  # Zustand auth store
├── types/                  # TypeScript type definitions
└── middleware.ts            # Route protection middleware
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## Authentication

- Token stored in `auth_token` cookie (7-day expiry)
- User data cached in `localStorage`
- Middleware protects all routes except `/login`
- Zustand store manages auth state client-side
