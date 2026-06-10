import dynamic from 'next/dynamic'

import { HeroSection } from '@/src/components/organisms/hero-section'
import { WhyReportingSection } from '@/src/components/organisms/why-reporting'
import { HarassmentTypesSection } from '@/src/components/organisms/harassment-types'
import { prisma } from '@/src/lib/prisma'

const ReportingProcessSection = dynamic(() => import('@/src/components/organisms/reporting-process').then(mod => mod.ReportingProcessSection))
const AwarenessPreviewSection = dynamic(() => import('@/src/components/organisms/awareness-preview').then(mod => mod.AwarenessPreviewSection))
const EventsCampaignSection = dynamic(() => import('@/src/components/organisms/events-campaign/events-campaign').then(mod => mod.EventsCampaignSection))
const FaqSection = dynamic(() => import('@/src/components/organisms/faq-section').then(mod => mod.FaqSection))
const ContactSection = dynamic(() => import('@/src/components/organisms/contact-section').then(mod => mod.ContactSection))
const Footer = dynamic(() => import('@/src/components/organisms/Footer').then(mod => mod.Footer))

export default async function HomePage() {
  const activeBanners = await prisma.campaignBanner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })

  const mappedBanners = activeBanners.map(b => ({
    id: b.id,
    imageUrl: b.imageUrl,
    title: b.title,
    linkUrl: b.linkUrl,
  }))

  const contentRecords = await prisma.siteContent.findMany({
    where: { key: 'faqs' }
  })
  type FAQType = { question: string; answer: string }
  const rawFaqs = contentRecords[0]?.value
  const customFaqs = Array.isArray(rawFaqs)
    ? (rawFaqs as unknown[]).filter((f): f is FAQType => typeof f === 'object' && f !== null && typeof (f as any).question === 'string' && typeof (f as any).answer === 'string')
    : undefined

  return (
    <>
      <HeroSection banners={mappedBanners} />
      <WhyReportingSection />
      <HarassmentTypesSection />
      <ReportingProcessSection />
      <AwarenessPreviewSection />
      <EventsCampaignSection />
      {/* <SurvivorSupportStories showSubmissionForm={false} /> */}
      <FaqSection featuredOnly={true} customFaqs={customFaqs} />
      <ContactSection />
      <Footer />
    </>
  )
}