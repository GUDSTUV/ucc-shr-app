import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Floating Back Button */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 rounded-md text-sm font-semibold text-gray-500 transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 sm:left-10 sm:top-10"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* Content */}
      <main className="w-full max-w-md">
        <div className="w-full space-y-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-[11px] text-gray-400">
        &copy; {new Date().getFullYear()} University of Cape Coast — CEGRAD.
      </div>
    </div>
  )
}
