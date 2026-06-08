import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PublicLayout } from '@/src/components/templates/public-layout'
import { SurvivorSupportStories } from '@/src/components/organisms/survivor-support-stories/survivor-support-stories'

export const metadata: Metadata = {
  title: 'Survivor Support Stories | CEGRAD',
  description:
    'Read anonymous stories from survivors who have gone through the reporting process at CEGRAD. Their experiences can help you feel less alone.',
}

export default function SupportStoriesPage() {
  return (
    <PublicLayout>
      <main className="space-y-12">
        <Suspense fallback={<div>Loading...</div>}>
          <SurvivorSupportStories />
        </Suspense>
      </main>
    </PublicLayout>
  )
}
