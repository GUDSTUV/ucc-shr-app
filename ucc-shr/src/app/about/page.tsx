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

  type CarouselImage = { url: string; caption: string; alt?: string }
  type BoardMember = { name: string; role: string; bio: string; initials: string; imageUrl?: string }

  const contentMap = contentRecords.reduce(
    (acc: Record<string, unknown>, record: { key: string; value: unknown }) => {
      acc[record.key] = record.value
      return acc
    },
    {} as Record<string, unknown>,
  )

  const rawCarousel = contentMap['aboutCarousel']
  const carousel = Array.isArray(rawCarousel)
    ? (rawCarousel as unknown[]).filter((i): i is CarouselImage => {
        if (typeof i !== 'object' || i === null) return false
        const r = i as Record<string, unknown>
        return typeof r.url === 'string' && typeof r.caption === 'string'
      })
    : undefined

  const rawBoard = contentMap['aboutBoard']
  const board = Array.isArray(rawBoard)
    ? (rawBoard as unknown[]).filter((i): i is BoardMember => {
        if (typeof i !== 'object' || i === null) return false
        const r = i as Record<string, unknown>
        return typeof r.name === 'string' && typeof r.role === 'string' && typeof r.bio === 'string' && typeof r.initials === 'string'
      })
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
