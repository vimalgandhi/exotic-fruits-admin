'use client'

import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface DataTableProductsProps {
  products: Product[]
}

export function DataTableProducts({ products }: DataTableProductsProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-navy-600">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-navy-600">
              Price
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-navy-600">
              Category
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-navy-600">
              Stock
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-gray-800">{product.name}</td>
              <td className="px-4 py-3 text-gray-800">
                {formatCurrency(product.price)}
              </td>
              <td className="px-4 py-3 text-gray-600">{product.category}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium text-white ${
                    product.stock === 'In Stock' ? 'bg-success-500' : 'bg-error-500'
                  }`}
                >
                  {product.stock}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
