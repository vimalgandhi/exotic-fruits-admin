'use client';

import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error
    logger.error('Global Error Page', error.message, error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Error Content */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Something Went Wrong!
          </h1>
          <p className="text-gray-600 text-sm">
            We encountered an unexpected error. Please try again or contact support.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg text-left">
              <p className="text-xs font-mono text-red-700 break-words">
                <strong>Error:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-red-600 mt-2">
                  <strong>ID:</strong> {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </div>

        {/* Support Message */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            If this problem persists, please contact our support team with the error ID above.
          </p>
        </div>
      </div>
    </div>
  );
}
