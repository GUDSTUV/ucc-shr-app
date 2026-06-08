import { HubSearchInput } from '@/src/components/molecules/hub-search-input'

interface HubHeaderProps {
  search: string
  onSearchChange: (value: string) => void
}

export function HubHeader({ search, onSearchChange }: HubHeaderProps) {
  return (
    <header className="space-y-4">
      <HubSearchInput value={search} onChange={onSearchChange} />
    </header>
  )
}
