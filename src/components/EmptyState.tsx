'use client'

import React from 'react'
import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 text-gray-400">
        {icon || <PackageOpen size={64} />}
      </div>
      <p className="text-xl font-bold text-navy">{title}</p>
      <p className="mt-2 text-center text-gray-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded bg-gold px-6 py-2 text-white transition-colors hover:bg-yellow-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
