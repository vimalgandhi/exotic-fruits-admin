import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="text-8xl font-bold text-gold-500">404</p>
      <h1 className="mt-4 text-3xl font-bold text-navy-600">Page Not Found</h1>
      <p className="mx-auto mt-3 max-w-md text-gray-500">
        Oops! The page you&#39;re looking for doesn&#39;t exist or has been
        moved. Let&#39;s get you back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="btn-primary"
        >
          Return Home
        </Link>
        <Link
          href="/products"
          className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
        >
          Browse Products
        </Link>
      </div>
    </div>
  )
}
