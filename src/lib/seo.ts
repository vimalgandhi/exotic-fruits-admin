import { Metadata } from 'next'
import { Product } from '@/types'

export const DEFAULT_SEO = {
  siteName: 'Exotic Fruits',
  siteUrl: 'https://exotic-fruits.com',
  defaultTitle: 'Exotic Fruits – Premium Exotic Fruits Delivered Fresh',
  defaultDescription:
    'Hand-picked premium exotic fruits from around the globe. Fresh, organic, and delivered straight to your doorstep.',
  defaultImage: 'https://exotic-fruits.com/og-image.jpg',
  twitterHandle: '@exoticfruits',
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  url?: string
  noIndex?: boolean
}): Metadata {
  const metaTitle = title
    ? `${title} | ${DEFAULT_SEO.siteName}`
    : DEFAULT_SEO.defaultTitle
  const metaDescription = description ?? DEFAULT_SEO.defaultDescription
  const metaImage = image ?? DEFAULT_SEO.defaultImage
  const metaUrl = url ?? DEFAULT_SEO.siteUrl

  return {
    title: metaTitle,
    description: metaDescription,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      siteName: DEFAULT_SEO.siteName,
      images: [{ url: metaImage, width: 1200, height: 630, alt: metaTitle }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      site: DEFAULT_SEO.twitterHandle,
    },
  }
}

export function productSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability:
        product.stock === 'In Stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEFAULT_SEO.siteName,
    url: DEFAULT_SEO.siteUrl,
    logo: `${DEFAULT_SEO.siteUrl}/logo.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-98765-43210',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  }
}
