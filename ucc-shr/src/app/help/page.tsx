import { HelpClient } from "./help-client"
import { Footer } from "@/src/components/organisms/Footer"
import { prisma } from '@/src/lib/prisma'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help & Support | CEGRAD UCC",
  description: "Get help, support, and answers to frequently asked questions.",
}

export default async function HelpPage() {
  let contentRecords: Array<{ key: string; value: unknown }> = []
  try {
    contentRecords = await prisma.siteContent.findMany({
      where: { key: { in: ['faqs'] } }
    })
  } catch (error) {
    console.error('Database connection failed in HelpPage, using fallback content:', error)
  }
  
  const contentMap = contentRecords.reduce((acc, record) => {
    acc[record.key] = record.value
    return acc
  }, {} as Record<string, unknown>)
  
  type FAQType = { question: string; answer: string }
  const rawFaqs = contentMap['faqs']
  const customFaqs = Array.isArray(rawFaqs)
    ? (rawFaqs as unknown[]).filter((f): f is FAQType => typeof f === 'object' && f !== null && typeof (f as any).question === 'string' && typeof (f as any).answer === 'string')
    : undefined

  return (
    <>
      <HelpClient 
        customFaqs={customFaqs} 
      />
      <Footer />
    </>
  )
}


