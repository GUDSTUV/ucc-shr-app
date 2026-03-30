'use client'

import { useEffect, useMemo, useState } from 'react'
import { HubHeader } from '@/src/components/organisms/hub-header/hub-header'
import { HubFilterChips } from '@/src/components/molecules/hub-filter-chips/hub-filter-chips'
import { HubFeedCard } from '@/src/components/organisms/hub-feed-card/hub-feed-card'

type HubCategory = 'All' | 'Awareness' | 'Events' | 'Rights'

type HubItem = {
  id: string
  resourceType: 'ARTICLE' | 'EVENT'
  resourceId: string
  href: string
  title: string
  excerpt: string
  category: Exclude<HubCategory, 'All'>
  readTime: string
  imageUrl?: string
  dateLabel?: string
  timeLabel?: string
  isRegistration?: boolean
  imageTheme: string
  isSaved: boolean
}

const categoryBadgeStyles: Record<Exclude<HubCategory, 'All'>, string> = {
  Awareness: 'bg-navy text-white border border-white/20 backdrop-blur-[1px]',
  Events: 'bg-navy/75 text-white border border-white/20 backdrop-blur-[1px]',
  Rights: 'bg-red/20 text-red border border-red/30 backdrop-blur-[1px]',
}

const categoryLabels: Record<HubCategory, string> = {
  All: 'All',
  Awareness: 'Awareness',
  Events: 'Events',
  Rights: 'Know Your Rights',
}

const categories: HubCategory[] = ['All', 'Awareness', 'Rights', 'Events']

type HubClientProps = {
  items: HubItem[]
  isAuthenticated: boolean
}

export function HubClient({ items, isAuthenticated }: HubClientProps) {
  const [feedItems, setFeedItems] = useState(items)
  const [activeCategory, setActiveCategory] = useState<HubCategory>('All')
  const [search, setSearch] = useState('')
  const [savingItemId, setSavingItemId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    setFeedItems(items)
  }, [items])

  async function toggleSave(item: HubItem) {
    if (!isAuthenticated) {
      setFeedback('Please log in to save resources to your account.')
      return
    }

    setSavingItemId(item.id)
    setFeedback(null)

    try {
      const response = await fetch('/api/user/saved', {
        method: item.isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType: item.resourceType,
          resourceId: item.resourceId,
        }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.error ?? 'Unable to update saved resources right now.')
      }

      setFeedItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                isSaved: !item.isSaved,
              }
            : entry,
        ),
      )
      setFeedback(item.isSaved ? 'Resource removed from your saved items.' : 'Resource saved to your account.')
    } catch (error: unknown) {
      setFeedback(error instanceof Error ? error.message : 'Unable to update saved resources right now.')
    } finally {
      setSavingItemId(null)
    }
  }

  const filteredItems = useMemo(() => {
    return feedItems.filter((item) => {
      const categoryMatch = activeCategory === 'All' || item.category === activeCategory
      const query = search.trim().toLowerCase()
      const searchMatch =
        query.length === 0 ||
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)

      return categoryMatch && searchMatch
    })
  }, [activeCategory, search, feedItems])

  return (
    <div className="font-sans">
      <HubHeader search={search} onSearchChange={setSearch} />
      <HubFilterChips
        categories={categories}
        categoryLabels={categoryLabels}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {feedback ? (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
          {feedback}
        </div>
      ) : null}

      <section className="mt-6 space-y-5">
        {filteredItems.map((item) => (
          <HubFeedCard
            key={item.id}
            href={item.href}
            title={item.title}
            excerpt={item.excerpt}
            category={item.category}
            readTime={item.readTime}
            imageUrl={item.imageUrl}
            dateLabel={item.dateLabel}
            timeLabel={item.timeLabel}
            isRegistration={item.isRegistration}
            imageTheme={item.imageTheme}
            categoryBadgeClass={categoryBadgeStyles[item.category]}
            isSaved={item.isSaved}
            isSaving={savingItemId === item.id}
            onToggleSave={() => toggleSave(item)}
          />
        ))}

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center text-sm text-gray-600">
            No results for this filter yet.
          </div>
        ) : null}
      </section>
    </div>
  )
}
