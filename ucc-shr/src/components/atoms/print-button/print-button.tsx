'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'

export function PrintButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className="gap-2 bg-white hidden sm:flex print:hidden"
    >
      <Printer size={16} />
      Print Report
    </Button>
  )
}
