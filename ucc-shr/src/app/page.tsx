import dynamic from 'next/dynamic'

import { HeroSection } from '@/src/components/organisms/hero-section'
import { WhyReportingSection } from '@/src/components/organisms/why-reporting'
import { HarassmentTypesSection } from '@/src/components/organisms/harassment-types'

const ReportingProcessSection = dynamic(() => import('@/src/components/organisms/reporting-process').then(mod => mod.ReportingProcessSection))
const AwarenessPreviewSection = dynamic(() => import('@/src/components/organisms/awareness-preview').then(mod => mod.AwarenessPreviewSection))
const EventsCampaignSection = dynamic(() => import('@/src/components/organisms/events-campaign/events-campaign').then(mod => mod.EventsCampaignSection))
const FaqSection = dynamic(() => import('@/src/components/organisms/faq-section').then(mod => mod.FaqSection))
const ContactSection = dynamic(() => import('@/src/components/organisms/contact-section').then(mod => mod.ContactSection))
const Footer = dynamic(() => import('@/src/components/organisms/Footer').then(mod => mod.Footer))

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyReportingSection />
      <HarassmentTypesSection />
      <ReportingProcessSection />
      <AwarenessPreviewSection />
      <EventsCampaignSection />
      {/* <SurvivorSupportStories showSubmissionForm={false} /> */}
      <FaqSection featuredOnly={true} />
      <ContactSection />
      <Footer />
    </>
  )
}