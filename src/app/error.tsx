'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-bold text-navy md:text-9xl">500</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-700">
        Something Went Wrong
      </h2>
      <p className="mt-3 max-w-md text-gray-500">
        An unexpected error has occurred. Please try again or contact support if
        the problem persists.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-navy px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-900"
      >
        Try Again
      </button>
    </div>
  )
}
