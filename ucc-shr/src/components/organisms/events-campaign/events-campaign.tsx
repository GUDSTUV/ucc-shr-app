'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { HubFeedCard } from '@/src/components/organisms/hub-feed-card'

// ─── Seed data — 2 events + 1 article ────────────────────────────────────────
// Matches the exact prop shape HubFeedCard + the hub page DB mapping uses.
// To go live: replace with a server component that runs:
//   const events = await prisma.event.findMany({ where: { published: true }, orderBy: { startDate: 'asc' }, take: 2 })
//   const articles = await prisma.article.findMany({ where: { published: true }, orderBy: { updatedAt: 'desc' }, take: 1 })
// then map them into items[] below using the same field names.
const items = [
  {
    id: 'e1',
    href: '/events',
    title: 'Breaking the Silence: Sexual Harassment on Campus',
    excerpt:
      'An open session for students, staff, and faculty on recognising and safely reporting sexual harassment in academic environments.',
    category: 'Events',
    readTime: 'Event',
    imageUrl: '/images/events/event-1.jpg',
    imageTheme: 'from-navy-dark via-navy to-gray-900',
    categoryBadgeClass: 'bg-navy/75 text-white border border-white/20 backdrop-blur-[1px]',
    dateLabel: 'JUN 20',
    timeLabel: '10:00 AM',
    isRegistration: true,
  },
  {
    id: 'e2',
    href: '/events',
    title: 'Bystander Intervention Training',
    excerpt:
      'Practical, scenario-based training on how to safely intervene when you witness harassment — no prior experience required.',
    category: 'Events',
    readTime: 'Event',
    imageUrl: '/images/events/event-2.jpg',
    imageTheme: 'from-navy-dark via-navy to-gray-900',
    categoryBadgeClass: 'bg-navy/75 text-white border border-white/20 backdrop-blur-[1px]',
    dateLabel: 'JUL 05',
    timeLabel: '2:00 PM',
    isRegistration: true,
  },
  {
    id: 'a1',
    href: '/hub/understanding-campus-harassment-policy',
    title: 'Understanding UCC Campus Harassment Policy',
    excerpt:
      'A clear breakdown of the University of Cape Coast sexual harassment policy — what it covers, how complaints are handled, and your rights as a reporter.',
    category: 'Awareness',
    readTime: '4 min read',
    imageUrl: '/images/awareness/policy-guide.jpg',
    imageTheme: 'from-navy-light via-white to-gray-100',
    categoryBadgeClass: 'bg-navy text-white border border-white/20 backdrop-blur-[1px]',
    dateLabel: undefined,
    timeLabel: undefined,
    isRegistration: false,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function EventsCampaignSection() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Header row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-navy">
              Events &amp; Campaigns
            </span>
            <h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">
              Awareness in Action
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600">
              CEGRAD runs workshops, policy forums, and awareness campaigns throughout the year. Join us to learn, engage, and advocate.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy transition-colors hover:text-navy-dark"
          >
            All events <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* ── Cards — same HubFeedCard used on /hub ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <HubFeedCard
                href={item.href}
                title={item.title}
                excerpt={item.excerpt}
                category={item.category}
                readTime={item.readTime}
                imageUrl={item.imageUrl}
                imageTheme={item.imageTheme}
                categoryBadgeClass={item.categoryBadgeClass}
                dateLabel={item.dateLabel}
                timeLabel={item.timeLabel}
                isRegistration={item.isRegistration}
                isSaved={false}
                isSaving={false}
                onToggleSave={() => {}}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
