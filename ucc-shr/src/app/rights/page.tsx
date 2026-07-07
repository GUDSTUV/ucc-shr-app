import type { Metadata } from 'next'
import { RightsClient } from '@/src/app/rights/rights-client'

export const metadata: Metadata = {
  title: 'Know Your Rights | CEGRAD-UCC',
  description: 'Understand your rights and responsibilities under the UCC Anti-Sexual Harassment Policy.',
}

export default function RightsPage() {
  return <RightsClient />
}
