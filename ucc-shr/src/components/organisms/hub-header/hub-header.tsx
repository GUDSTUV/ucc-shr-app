import Link from 'next/link'
import { Bell, UserRound } from 'lucide-react'
import { HubSearchInput } from '@/src/components/molecules/hub-search-input'

interface HubHeaderProps {
  search: string
  onSearchChange: (value: string) => void
}

export function HubHeader({ search, onSearchChange }: HubHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/user/profile"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-light text-navy"
          aria-label="Open profile"
        >
          <UserRound size={20} />
        </Link>

        <h1 className="text-xl font-semibold text-navy md:text-2xl">Posts &amp; Events</h1>

        <Link
          href="/user/notifications"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-light text-navy"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </Link>
      </div>

      <HubSearchInput value={search} onChange={onSearchChange} />
    </header>
  )
}
