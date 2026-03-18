interface StatCardProps {
  title: string
  value: string | number
  trend?: number
  trendColor?: 'green' | 'red'
  icon?: React.ReactNode
}

import React from 'react'

export function StatCard({
  title,
  value,
  trend,
  trendColor = 'green',
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon && <div className="text-gold">{icon}</div>}
      </div>
      <p className="mt-2 text-3xl font-bold text-navy">{value}</p>
      {trend !== undefined && (
        <p
          className={`mt-2 text-sm ${
            trendColor === 'green' ? 'text-success' : 'text-error'
          }`}
        >
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>
      )}
    </div>
  )
}
