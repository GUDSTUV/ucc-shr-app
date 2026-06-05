'use client'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export interface TopBarProps {
  title: string
  showBack?: boolean
  rightSlot?: React.ReactNode
}

export function TopBar({ title, showBack, rightSlot }: TopBarProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 md:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
          </button>
        ) : null}
        <h1 className="text-[15px] md:text-base font-semibold text-gray-900">{title}</h1>
      </div>
      <div>{rightSlot}</div>
    </header>
  )
}
