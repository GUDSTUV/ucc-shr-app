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
  
  const customFaqs = Array.isArray(contentRecords[0]?.value) 
    ? contentRecords[0].value as any 
    : undefined

  return <HelpClient customFaqs={customFaqs} />
}
