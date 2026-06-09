'use client'
import { X } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'

export function PanicButton() {
  const exit = () => {
    sessionStorage.clear()
    window.location.replace('https://ucc.edu.gh')
  }

  return (
    <Button
      variant="unstyled"
      onClick={exit}
      className="fixed top-3 right-3 z-[999] bg-red text-white
        rounded-full px-4 py-2 text-xs font-bold
        flex items-center gap-1.5 shadow-md
        min-h-[44px] active:scale-95 transition-transform">
      <X size={13} />Quick Exit
    </Button>
  )
}