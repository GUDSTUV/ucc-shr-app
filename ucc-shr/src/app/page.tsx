import dynamic from 'next/dynamic'

import { HeroSection } from '@/src/components/organisms/hero-section'
import { WhyReportingSection } from '@/src/components/organisms/why-reporting'
import { prisma } from '@/src/lib/prisma'

const ReportingProcessSection = dynamic(() => import('@/src/components/organisms/reporting-process').then(mod => mod.ReportingProcessSection))
const AwarenessPreviewSection = dynamic(() => import('@/src/components/organisms/awareness-preview').then(mod => mod.AwarenessPreviewSection))
const EventsCampaignSection = dynamic(() => import('@/src/components/organisms/events-campaign/events-campaign').then(mod => mod.EventsCampaignSection))
const FaqSection = dynamic(() => import('@/src/components/organisms/faq-section').then(mod => mod.FaqSection))
const ContactSection = dynamic(() => import('@/src/components/organisms/contact-section').then(mod => mod.ContactSection))
const Footer = dynamic(() => import('@/src/components/organisms/Footer').then(mod => mod.Footer))

export default async function HomePage() {
  let activeBanners: Array<{ id: string; imageUrl: string; title: string; linkUrl: string | null }> = []
  let contentRecords: Array<{ key: string; value: unknown }> = []

  try {
    const [bannersResult, contentResult] = await Promise.all([
      prisma.campaignBanner.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.siteContent.findMany({
        where: { key: { in: ['faqs', 'heroTitle', 'heroSubtitle'] } }
      }),
    ])

    activeBanners = bannersResult
    contentRecords = contentResult
  } catch (error) {
    console.error('Home page DB fetch failed, using fallback content:', error)
  }

  const mappedBanners = activeBanners.map(b => ({
    id: b.id,
    imageUrl: b.imageUrl,
    title: b.title,
    linkUrl: b.linkUrl,
  }))
  
  const contentMap = contentRecords.reduce((acc, record) => {
    acc[record.key] = record.value
    return acc
  }, {} as Record<string, unknown>)

  type FAQType = { question: string; answer: string }
  const rawFaqs = contentMap['faqs']
  const customFaqs = Array.isArray(rawFaqs)
    ? (rawFaqs as unknown[]).filter((f): f is FAQType => typeof f === 'object' && f !== null && typeof (f as any).question === 'string' && typeof (f as any).answer === 'string')
    : undefined

  const heroTitle = typeof contentMap['heroTitle'] === 'string' ? contentMap['heroTitle'] : undefined
  const heroSubtitle = typeof contentMap['heroSubtitle'] === 'string' ? contentMap['heroSubtitle'] : undefined

  return (
    <>
      <HeroSection banners={mappedBanners} customTitle={heroTitle} customSubtitle={heroSubtitle} />
      <WhyReportingSection />
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
