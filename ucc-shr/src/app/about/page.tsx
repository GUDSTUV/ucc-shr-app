import { AboutHero } from '@/src/components/organisms/about-hero'
import { AboutMission } from '@/src/components/organisms/about-mission'
import { AboutBoard } from '@/src/components/organisms/about-board'
import { AboutPartners } from '@/src/components/organisms/about-partners'
import { Footer } from '@/src/components/organisms/Footer'
import { prisma } from '@/src/lib/prisma'

const CAROUSEL = [
  {
    url: "/images/about/about-1.jpg",
    caption: "",
  },
  {
    url: "/images/about/about-2.jpg",
    caption: "",
  }
]

export default async function AboutPage() {
  const contentRecords = await prisma.siteContent.findMany({
    where: { key: { in: ['aboutBoard'] } }
  })

  type BoardMember = { name: string; role: string; bio: string; initials: string; imageUrl?: string }

  const contentMap = contentRecords.reduce(
    (acc: Record<string, unknown>, record: { key: string; value: unknown }) => {
      acc[record.key] = record.value
      return acc
    },
    {} as Record<string, unknown>,
  )

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
        <AboutHero customImages={CAROUSEL} />
        <AboutMission />
        <AboutBoard customMembers={board} />
        <AboutPartners />
      </div>
      <Footer />
    </>
  )
}
