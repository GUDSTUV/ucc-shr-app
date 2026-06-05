import { auth } from '@/src/lib/auth/auth'
import { HeroSection } from '@/src/components/organisms/hero-section'
import { WhyReportingSection } from '@/src/components/organisms/why-reporting'
import { HarassmentTypesSection } from '@/src/components/organisms/harassment-types'
import { ReportingProcessSection } from '@/src/components/organisms/reporting-process'
import { AwarenessPreviewSection } from '@/src/components/organisms/awareness-preview'
import { EventsCampaignSection } from '@/src/components/organisms/events-campaign/events-campaign'
import { SurvivorSupportStories } from '@/src/components/organisms/survivor-support-stories/survivor-support-stories'
import { ContactSection } from '@/src/components/organisms/contact-section'
import { Footer } from '@/src/components/organisms/Footer'

export default async function HomePage() {
  const session = await auth()
  const isSignedInUser =
    Boolean(session?.user) && session?.user?.role !== 'SUPER_ADMIN'
  const reportHref = isSignedInUser ? '/user/userDashboard' : '/report'

  return (
    <>
      <HeroSection reportHref={reportHref} />
      <WhyReportingSection />
      <HarassmentTypesSection />
      <ReportingProcessSection />
      <AwarenessPreviewSection />
      <EventsCampaignSection />
      <SurvivorSupportStories showSubmissionForm={false} />
      <ContactSection />
      <Footer />
    </>
  )
}