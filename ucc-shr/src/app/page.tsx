import { PublicLayout } from '@/src/components/templates/public-layout'
import { Button }       from '@/src/components/atoms/button'
import { AlertBox }     from '@/src/components/molecules/alert-box'
import { HomeSwiper }   from '@/src/components/organisms/home-swiper'
import { HomeEventsPreview } from '@/src/components/organisms/home-events-preview'
import { HomeEmergencyCard } from '@/src/components/organisms/home-emergency-card'
import { HomeFaq } from '@/src/components/organisms/home-faq'
import { auth } from '@/src/lib/auth/auth'
import { Flag, SearchCheck } from 'lucide-react'
import Image from 'next/image'
import Link             from 'next/link'

export default async function HomePage() {
  const session = await auth()
  const isSignedInUser = Boolean(session?.user) && session?.user?.role !== 'SUPER_ADMIN'
  const reportHref = isSignedInUser ? '/user/userDashboard' : '/report'

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="-mx-4 -mt-6 bg-navy px-6 py-8 mb-8 rounded-bl-xl rounded-br-xl text-white">
        <div className="flex items-center mt-8 gap-5">
          {/* Logo */}
          <div className="shrink-0 inline-flex items-center justify-center rounded-xl bg-white/10 p-3">
            <Image
              src="/icons/logo.svg"
              alt="CEGRAD logo"
              width={52}
              height={52}
              priority
              className="h-13 w-13"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-widest opacity-50 uppercase mb-1">
              University of Cape Coast
            </p>
            <h1 className="text-3xl font-bold leading-tight mb-1">CEGRAD</h1>
            <p className="text-sm opacity-70 font-light">
              Centre for Gender Research, Advocacy & Documentation
            </p>
          </div>
        </div>
      </div>

      {/* Swipeable message slider */}
      <HomeSwiper />

      {/* Report CTA */}
      <Link href={reportHref}>
        <Button variant="report" size="lg">
          <Flag size={20} /> Report an Incident
        </Button>
      </Link>

      {/* Quick actions */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/track" className="block">
          <Button variant="outline" fullWidth>
            <SearchCheck size={18} /> Track Report
          </Button>
        </Link>
      </div>

      {/* Safety message */}
      <AlertBox
        variant="info"
        title="Your report is confidential"
        noBackground
        noBorder
        className="p-0"
      >
        All submissions are anonymous and seen only by CEGRAD staff.
      </AlertBox>

      <HomeEventsPreview />
      <HomeEmergencyCard />
      <HomeFaq />
    </PublicLayout>
  )
}