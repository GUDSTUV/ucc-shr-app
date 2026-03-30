// Used by: all /admin/* pages
import { AdminSidebar } from '@/src/components/organisms/admin-sidebar'

interface AdminLayoutProps {
  title:    string
  description?: string
  children: React.ReactNode
  unreadNotificationsCount?: number
  actions?: React.ReactNode
}

export function AdminLayout({
  title,
  description,
  children,
  unreadNotificationsCount,
  actions,
}: AdminLayoutProps) {
  return (
    <div className="flex min-h-dvh bg-gray-50 font-sans text-[15px] text-gray-900">
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy focus:shadow"
      >
        Skip to main content
      </a>

      <AdminSidebar unreadNotificationsCount={unreadNotificationsCount} />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-dvh w-full max-w-310 flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">{title}</h1>
                {description ? <p className="mt-1 max-w-3xl text-base leading-relaxed text-gray-700">{description}</p> : null}
              </div>
              {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
            </div>
          </header>

          <main id="admin-main-content" className="flex-1">
            {children}
          </main>

          <footer className="mt-8 border-t border-gray-200 pt-4 text-sm text-gray-600">
            <p>UCC CEGRAD Admin Dashboard</p>
            <p className="mt-1">Confidential case data. Access for authorized staff only.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}