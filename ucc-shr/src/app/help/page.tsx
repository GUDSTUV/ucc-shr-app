import { HelpClient } from "./help-client"
import { prisma } from '@/src/lib/prisma'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help & Support | CEGRAD UCC",
  description: "Get help, support, and answers to frequently asked questions.",
}

export default async function HelpPage() {
  const contentRecords = await prisma.siteContent.findMany({
    where: { key: 'faqs' }
  })
  
  type FAQType = { question: string; answer: string }
  const rawFaqs = contentRecords[0]?.value
  const customFaqs = Array.isArray(rawFaqs)
    ? (rawFaqs as unknown[]).filter((f): f is FAQType => typeof f === 'object' && f !== null && typeof (f as any).question === 'string' && typeof (f as any).answer === 'string')
    : undefined

  return <HelpClient customFaqs={customFaqs} />
}
