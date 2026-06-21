// Used by: Report page, Login page
import { TopBar } from '@/src/components/organisms/top-bar'

interface FormLayoutProps {
  title:    string
  children: React.ReactNode
  hideTopBar?: boolean
}

export function FormLayout({ title, children, hideTopBar }: FormLayoutProps) {
  return (
    <div className="min-h-dvh bg-gray-50">
      {!hideTopBar && <TopBar title={title} showBack />}
      <div className="mx-auto max-w-xl px-4 py-6 flex flex-col gap-5 md:max-w-2xl md:px-6 lg:max-w-3xl">
        {children}
      </div>
    </div>
  )
}