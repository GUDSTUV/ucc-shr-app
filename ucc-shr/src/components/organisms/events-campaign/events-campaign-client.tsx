'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { HubFeedCard } from '@/src/components/organisms/hub-feed-card'

export type CampaignFeedItem = {
  id: string
  href: string
  title: string
  excerpt: string
  category: string
  readTime: string
  imageUrl?: string
  imageTheme: string
  categoryBadgeClass: string
  dateLabel?: string
  timeLabel?: string
  isRegistration?: boolean
}

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

export function EventsCampaignClient({ items }: { items: CampaignFeedItem[] }) {
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
              CEGRAD runs workshops, policy forums, and awareness campaigns throughout
              the year. Join us to learn, engage, and advocate.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy transition-colors hover:text-navy-dark"
          >
            All Posts &amp; Events <ArrowRight size={15} />
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
