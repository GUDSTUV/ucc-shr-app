import { HelpClient } from "./help-client"
import { Footer } from "@/src/components/organisms/Footer"
import { prisma } from '@/src/lib/prisma'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help & Support | CEGRAD UCC",
  description: "Get help, support, and answers to frequently asked questions.",
}

export default async function HelpPage() {
  const contentRecords = await prisma.siteContent.findMany({
    where: { key: { in: ['faqs', 'contactEmail', 'contactPhone', 'contactAddress'] } }
  })
  
  const contentMap = contentRecords.reduce((acc, record) => {
    acc[record.key] = record.value
    return acc
  }, {} as Record<string, unknown>)
  
  type FAQType = { question: string; answer: string }
  const rawFaqs = contentMap['faqs']
  const customFaqs = Array.isArray(rawFaqs)
    ? (rawFaqs as unknown[]).filter((f): f is FAQType => typeof f === 'object' && f !== null && typeof (f as any).question === 'string' && typeof (f as any).answer === 'string')
    : undefined

  const customEmail = typeof contentMap['contactEmail'] === 'string' ? contentMap['contactEmail'] : undefined
  const customPhone = typeof contentMap['contactPhone'] === 'string' ? contentMap['contactPhone'] : undefined
  const customAddress = typeof contentMap['contactAddress'] === 'string' ? contentMap['contactAddress'] : undefined

  return (
    <>
      <HelpClient 
        customFaqs={customFaqs} 
        customEmail={customEmail}
        customPhone={customPhone}
        customAddress={customAddress}
      />
      <Footer />
    </>
  )
}


