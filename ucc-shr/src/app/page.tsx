import { HeroSection } from '@/src/components/organisms/hero-section'
import { WhyReportingSection } from '@/src/components/organisms/why-reporting'
import { HarassmentTypesSection } from '@/src/components/organisms/harassment-types'
import { ReportingProcessSection } from '@/src/components/organisms/reporting-process'
import { AwarenessPreviewSection } from '@/src/components/organisms/awareness-preview'
import { EventsCampaignSection } from '@/src/components/organisms/events-campaign/events-campaign'
import { FaqSection } from '@/src/components/organisms/faq-section'
import { ContactSection } from '@/src/components/organisms/contact-section'
import { Footer } from '@/src/components/organisms/Footer'

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