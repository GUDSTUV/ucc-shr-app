import { HeroSection } from '@/src/components/organisms/hero-section/hero-section'
import { ReportingProcessSection } from '@/src/components/organisms/reporting-process/reporting-process'
import { WhyReportingSection } from '@/src/components/organisms/why-reporting/why-reporting'
import { AwarenessPreviewSection } from '@/src/components/organisms/awareness-preview/awareness-preview'
import { FaqSection } from '@/src/components/organisms/faq-section/faq-section'
import { ContactSection } from '@/src/components/organisms/contact-section/contact-section'

interface HomePageContentProps {
  reportHref: string
}

export function HomePageContent({ reportHref }: HomePageContentProps) {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <HeroSection />
      <WhyReportingSection />
      <ReportingProcessSection />
      <AwarenessPreviewSection />
      <FaqSection featuredOnly showHelpLink />
      <ContactSection />
    </div>
  )
}
