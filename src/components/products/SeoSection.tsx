'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '@/components/ui/input';

export interface SeoFormFields {
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoAlt?: string;
  seoIndex?: boolean;
  seoFollow?: boolean;
  seoCanonical?: string;
  seoOgTitle?: string;
  seoOgDescription?: string;
  seoOgImage?: string;
  seoTwitterTitle?: string;
  seoTwitterDescription?: string;
  seoTwitterImage?: string;
  seoSchemaJson?: string;
}

interface SeoSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

export default function SeoSection({ register, errors }: SeoSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <button
        type="button"
        className="w-full flex items-center justify-between p-6 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          <h2 className="text-base font-semibold text-gray-900">Advanced SEO</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Meta tags, Open Graph, Twitter Card, and structured data
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-100 pt-4">
          {/* Meta */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Meta Tags</h3>
            <div className="space-y-3">
              <Input
                label="Meta Title"
                placeholder="SEO title (recommended: 50–60 characters)"
                {...register('seoMetaTitle')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="SEO description (recommended: 150–160 characters)"
                  {...register('seoMetaDescription')}
                />
              </div>
              <Input
                label="SEO Alt Text"
                placeholder="Alt text for the product image (for SEO)"
                {...register('seoAlt')}
              />
              <Input
                label="Canonical URL"
                placeholder="https://example.com/products/dragon-fruit"
                error={errors.seoCanonical?.message as string | undefined}
                {...register('seoCanonical')}
              />
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    {...register('seoIndex')}
                  />
                  <span className="text-sm text-gray-700">Index</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    {...register('seoFollow')}
                  />
                  <span className="text-sm text-gray-700">Follow</span>
                </label>
              </div>
            </div>
          </div>

          {/* Open Graph */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Open Graph (OG)</h3>
            <div className="space-y-3">
              <Input
                label="OG Title"
                placeholder="Title for social sharing"
                {...register('seoOgTitle')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OG Description
                </label>
                <textarea
                  rows={2}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Description for social sharing"
                  {...register('seoOgDescription')}
                />
              </div>
              <Input
                label="OG Image URL"
                placeholder="https://example.com/og-image.jpg"
                {...register('seoOgImage')}
              />
            </div>
          </div>

          {/* Twitter Card */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Twitter Card</h3>
            <div className="space-y-3">
              <Input
                label="Twitter Title"
                placeholder="Title for Twitter"
                {...register('seoTwitterTitle')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter Description
                </label>
                <textarea
                  rows={2}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Description for Twitter"
                  {...register('seoTwitterDescription')}
                />
              </div>
              <Input
                label="Twitter Image URL"
                placeholder="https://example.com/twitter-image.jpg"
                {...register('seoTwitterImage')}
              />
            </div>
          </div>

          {/* JSON-LD Schema */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">JSON-LD Schema</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schema JSON</label>
              <textarea
                rows={5}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Product"\n}'}
                {...register('seoSchemaJson')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
