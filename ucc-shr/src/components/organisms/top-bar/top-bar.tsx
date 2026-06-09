'use client'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/atoms/button/button'
import { Text } from '@/src/components/atoms/text/text'

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
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="w-9 h-9 !p-0 rounded-full hover:bg-gray-100 transition-colors inline-flex justify-center"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
          </Button>
        ) : null}
        <Text as="h1" size={{ base: 'sm', md: 'base' }} weight="semibold" className="text-gray-900">{title}</Text>
      </div>
      <div>{rightSlot}</div>
    </header>
  )
}
