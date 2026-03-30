import Link from 'next/link'
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'

export default async function PrivacyPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gray-50 pb-8 font-sans text-gray-900">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/user/profile"
            aria-label="Go back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="pr-8 text-lg font-bold text-navy">Privacy & Security</h1>
        </div>
      </header>

      <main className="space-y-3 px-4 pt-5">
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy-light text-navy">
            <ShieldCheck size={18} />
          </div>
          <h2 className="text-sm font-semibold text-gray-900">Account Security</h2>
          <p className="mt-1 text-sm text-gray-600">
            Your account is protected by your login credentials. Keep your password private.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy-light text-navy">
            <Lock size={18} />
          </div>
          <h2 className="text-sm font-semibold text-gray-900">Data Privacy</h2>
          <p className="mt-1 text-sm text-gray-600">
            Only authorized personnel can access your submitted reports and account data.
          </p>
        </section>
      </main>
    </div>
  )
}
