// Used by: Report page, Login page
import { TopBar } from '@/src/components/organisms/top-bar'

interface FormLayoutProps {
  title:    string
  children: React.ReactNode
}

export function FormLayout({ title, children }: FormLayoutProps) {
  return (
    <div className="min-h-dvh bg-gray-50">
      <TopBar title={title} showBack />
      <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5">
        {children}
      </div>
    </div>
  )
}