import { ChevronDown } from 'lucide-react'
import { Text } from '../../atoms/text/text'

interface FaqItemProps {
  question: string
  answer: string
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm open:border-navy/20">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <Text as="span" size="sm" weight="semibold">{question}</Text>
        <ChevronDown size={16} className="text-gray-500 transition-transform group-open:rotate-180" />
      </summary>
      <Text size="sm" tone="muted" className="pt-2 leading-relaxed">{answer}</Text>
    </details>
  )
}
