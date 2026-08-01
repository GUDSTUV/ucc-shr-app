'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { HubFeedCard } from '@/src/components/organisms/hub-feed-card'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { saveResource, unsaveResource } from '@/src/app/actions/savedResources'

export type CampaignFeedItem = {
  id: string
  resourceType: 'ARTICLE' | 'EVENT'
  resourceId: string
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
  googleCalendarUrl?: string
  isSaved: boolean
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

export function EventsCampaignClient({ items: initialItems, isAuthenticated }: { items: CampaignFeedItem[]; isAuthenticated: boolean }) {
  const [items, setItems] = useState(initialItems)
  const [savingItemId, setSavingItemId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  async function toggleSave(item: CampaignFeedItem) {
    if (!isAuthenticated) {
      setFeedback('Please log in to save resources.')
      setTimeout(() => setFeedback(null), 3000)
      return
    }

    setSavingItemId(item.id)
    setFeedback(null)

    try {
      const result = item.isSaved
        ? await unsaveResource(item.resourceType, item.resourceId)
        : await saveResource(item.resourceType, item.resourceId)

      if (!result.ok) {
        throw new Error(result.error ?? 'Unable to update saved resources right now.')
      }

      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, isSaved: !item.isSaved } : entry,
        ),
      )
      setFeedback(item.isSaved ? 'Resource removed from saved items.' : 'Resource saved.')
      setTimeout(() => setFeedback(null), 3000)
    } catch (error: unknown) {
      setFeedback(error instanceof Error ? error.message : 'Error updating resource.')
      setTimeout(() => setFeedback(null), 3000)
    } finally {
      setSavingItemId(null)
    }
  }

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <Text as="span" size="xs" weight="medium" tone="navy" className="uppercase tracking-widest">
              Events &amp; Campaigns
            </Text>
            <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="semibold" className="mt-2">
              Awareness in Action
            </Heading>
            <Text size="base" tone="muted" leading="relaxed" className="mt-3 max-w-xl">
              CEGRAD runs workshops, policy forums, and awareness campaigns throughout
              the year. Join us to learn, engage, and advocate.
            </Text>
          </div>
          <Link
            href="/hub"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-navy transition-colors hover:text-red"
          >
            All Posts &amp; Events <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="mt-6 flex justify-center">
            <div className={`rounded-xl border px-4 py-3 text-sm ${
              feedback.toLowerCase().includes('saved') || feedback.toLowerCase().includes('removed')
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}>
              {feedback}
            </div>
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-10 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3"
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
                showBookmark={item.category !== 'Events'}
                googleCalendarUrl={item.googleCalendarUrl}
                isSaved={item.isSaved}
                isSaving={savingItemId === item.id}
                onToggleSave={() => toggleSave(item)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
