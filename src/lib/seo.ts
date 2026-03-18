import { Metadata } from 'next'

const SITE_NAME = 'Exotic Fruits'
const SITE_URL = 'https://exoticfruits.in'
const SITE_DESCRIPTION =
  'Premium exotic fruits from around the globe, delivered fresh to your doorstep in India.'

interface SeoOptions {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

/**
 * Generate Next.js Metadata for a page, including OpenGraph and Twitter tags.
 */
export function generateMetadata(options: SeoOptions = {}): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    path = '',
    image = `${SITE_URL}/og-image.jpg`,
    type = 'website',
    noIndex = false,
  } = options

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const url = `${SITE_URL}${path}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  }
}

const AVAILABILITY_MAP: Record<'InStock' | 'OutOfStock', string> = {
  InStock: 'https://schema.org/InStock',
  OutOfStock: 'https://schema.org/OutOfStock',
}

/**
 * Generate JSON-LD Schema.org markup for a product.
 */
export function productSchema(product: {
  name: string
  description: string
  image: string
  price: number
  slug: string
  availability?: 'InStock' | 'OutOfStock'
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${SITE_URL}/products/${product.slug}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: AVAILABILITY_MAP[product.availability ?? 'InStock'],
      url: `${SITE_URL}/products/${product.slug}`,
    },
  }
}

/**
 * Generate JSON-LD Schema.org markup for the organisation.
 */
export function organisationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-98765-43210',
      contactType: 'Customer Service',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://www.instagram.com/exoticfruits.in',
      'https://www.facebook.com/exoticfruits.in',
    ],
  }
}
