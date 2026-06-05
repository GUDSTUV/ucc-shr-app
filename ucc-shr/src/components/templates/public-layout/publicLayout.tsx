// Used by: Hub, Events, Help, About pages
interface PublicLayoutProps { children: React.ReactNode }

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-6 md:max-w-4xl md:px-6 lg:max-w-7xl lg:px-8">
        {children}
      </div>
    </div>
  )
}