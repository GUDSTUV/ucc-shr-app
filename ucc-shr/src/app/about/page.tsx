import { AboutHero } from '@/src/components/organisms/about-hero'
import { AboutMission } from '@/src/components/organisms/about-mission'
import { AboutBoard } from '@/src/components/organisms/about-board'
import { AboutPartners } from '@/src/components/organisms/about-partners'
import { Footer } from '@/src/components/organisms/Footer'

export default function AboutPage() {
  return (
    <>
      <div className="bg-gray-50 pb-16">
        <AboutHero />
        <AboutMission />
        <AboutBoard />
        <AboutPartners />
      </div>
      <Footer />
    </>
  )
}
