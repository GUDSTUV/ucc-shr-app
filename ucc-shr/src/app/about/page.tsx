import { AboutHero } from '@/src/components/organisms/about-hero'
import { AboutMission } from '@/src/components/organisms/about-mission'
import { AboutBoard } from '@/src/components/organisms/about-board'
import { AboutPartners } from '@/src/components/organisms/about-partners'
import { Footer } from '@/src/components/organisms/Footer'
import { prisma } from '@/src/lib/prisma'

export default async function AboutPage() {
  const contentRecords = await prisma.siteContent.findMany({
    where: { key: { in: ['aboutCarousel', 'aboutBoard'] } }
  })

  const contentMap = contentRecords.reduce((acc, record) => {
    acc[record.key] = record.value as any
    return acc
  }, {} as Record<string, any>)

  const carousel = Array.isArray(contentMap['aboutCarousel']) && contentMap['aboutCarousel'].length > 0 
    ? contentMap['aboutCarousel'] 
    : undefined

  const board = Array.isArray(contentMap['aboutBoard']) && contentMap['aboutBoard'].length > 0 
    ? contentMap['aboutBoard'] 
    : undefined

  return (
    <>
      <div className="bg-gray-50 pb-16">
        <AboutHero customImages={carousel} />
        <AboutMission />
        <AboutBoard customMembers={board} />
        <AboutPartners />
      </div>
      <Footer />
    </>
  )
}
