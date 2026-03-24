'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error-500/10">
        <AlertTriangle size={40} className="text-error-500" />
      </div>
      <h1 className="mt-6 text-4xl font-bold text-navy-600">
        Something went wrong
      </h1>
      <p className="mx-auto mt-3 max-w-md text-gray-500">
        An unexpected error occurred. Our team has been notified. Please try
        again or return to the home page.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-gray-400">
          Error ID: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
