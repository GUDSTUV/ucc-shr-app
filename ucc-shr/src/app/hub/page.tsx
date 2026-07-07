import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth/auth'
import dynamic from 'next/dynamic'
import { Footer } from '@/src/components/organisms/Footer'
import { AnimatedCounter } from '@/src/components/molecules/animated-counter/animated-counter'
import { FadeIn, FadeInStagger, FadeInItem } from '@/src/components/atoms/fade-in'
import Link from 'next/link'
import { Text } from '@/src/components/atoms/text'
import { Heading } from '@/src/components/atoms/heading'
import { stats, harassmentTypes, rights, consentPrinciples, policyPoints } from './constants'

import { Phone, CheckCircle2 } from 'lucide-react'
import { ConsentSection } from '@/src/components/organisms/consent-section/consent-section'
import { HarassmentTypesSection } from '@/src/components/organisms/harassment-types'
const ScenarioCards = dynamic(() => import('@/src/components/organisms/scenario-cards/scenario-cards').then(m => m.ScenarioCards))
const CampaignVideoPlayer = dynamic(() => import('@/src/components/organisms/campaign-video-player').then(m => m.CampaignVideoPlayer))

/* ─── Page ─── */

export default async function HubPage() {
	let contentRecords: { key: string, value: unknown }[] = []
	try {
		contentRecords = await prisma.siteContent.findMany({
			where: { key: { in: ['awarenessBanner', 'awarenessVideoUrl'] } }
		})
	} catch (error) {
		console.warn('Hub page DB fetch failed (Neon DB might be sleeping), using defaults.', error)
	}

	const contentMap = contentRecords.reduce((acc: Record<string, string>, record: { key: string; value: unknown }) => {
		// Safely strip double quotes if Prisma serialized it as a JSON string literal
		let val = typeof record.value === 'string' ? record.value : String(record.value || '');
		val = val.replace(/^"|"$/g, '');
		acc[record.key] = val;
		return acc;
	}, {} as Record<string, string>);

	const customBanner = contentMap['awarenessBanner'];
	const customVideo = contentMap['awarenessVideoUrl'];

	return (
		<>
			<div className="bg-gray-50">
				{/* ═══ Section 1: Awareness Banner ═══ */}
				<div className={`relative h-64 sm:h-80 lg:h-120 w-full ${!customBanner ? 'bg-gradient-to-br from-navy to-navy-light' : ''}`}>
					{customBanner && (
						<>
							<img src={customBanner} alt="Awareness Campaign Banner" className="absolute inset-0 h-full w-full object-cover" />
							<div className="absolute inset-0 bg-black/40" />
						</>
					)}
					<div className="absolute inset-0 flex items-center justify-center p-6 text-center">
						<div>
							<Text as="span" size="sm" weight="bold" tone="white" className="uppercase tracking-widest text-red-light drop-shadow-md">CEGRAD Campaigns</Text>
							<Heading as="h1" size={{ base: '4xl', sm: '5xl', lg: '6xl' }} tone="white" weight="bold" className="mt-4 drop-shadow-lg">
								Awareness & Prevention
							</Heading>
						</div>
					</div>
				</div>

				{/* ═══ Section 2: Quick Stats ═══ */}
				<section className="border-b border-gray-100 bg-white">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="grid grid-cols-2 divide-x divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 sm:grid-cols-4">
							{stats.map((stat) => (
								<div key={stat.value} className="flex flex-col items-center p-8 sm:p-10 text-center">
									<stat.icon className="h-6 w-6 text-navy" />
									<Text as="span" size="2xl" weight="semibold" tone="navy" className="mt-5 tracking-tight">
										<AnimatedCounter value={stat.value} />
									</Text>
									<Text as="span" size="sm" weight="medium" tone="muted" className="mt-2">
										{stat.label}
									</Text>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ═══ Section 3: What is Sexual Harassment ═══ */}
				<HarassmentTypesSection />

								{/* ═══ Section 4.5: Featured Campaign Media ═══ */}
				<section className="bg-white py-16 lg:py-24 border-b border-gray-100">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<FadeIn className="text-left mb-10">
							<Heading size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="semibold">Break The Silence</Heading>
							<Text size="lg" tone="muted" className="mt-3 max-w-4xl">
								Hear from CeGRAD leadership as they share the University's commitment to preventing sexual harassment, supporting survivors, and creating a safe and respectful campus for all.
							</Text>
						</FadeIn>
						
						{/* Featured Main Video */}
						<FadeIn delay={0.2} className="relative w-full">
							<div className="overflow-hidden ring-1 ring-gray-900/5 relative group">
								{/* Small Tag at bottom left */}
								<div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 z-10 pointer-events-none">
									<span className="text-sm md:text-base font-medium text-white drop-shadow-md">
										Message from CeGRAD Leadership
									</span>
								</div>
								<CampaignVideoPlayer videoUrl={customVideo} />
							</div>
						</FadeIn>
					</div>
				</section>
				{/* ═══ Section 4: Understanding Consent (F.R.I.E.S) ═══ */}
				<ConsentSection />

				{/* ═══ Section 5: Know Your Rights ═══ */}
				<section className="bg-navy py-16 lg:py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<FadeIn className="text-center">
							<Text as="span" size="xs" weight="medium" tone="white" className="uppercase tracking-widest opacity-80">Your Protections</Text>
							<Heading size={{ base: '3xl', lg: '4xl' }} tone="white" weight="semibold" className="mt-2">Know Your Rights</Heading>
							<Text size="lg" tone="white" className="mx-auto mt-3 max-w-2xl opacity-80">
								As a member of the UCC community, you are protected by comprehensive university policies and national laws. Understand your fundamental rights.
							</Text>
						</FadeIn>

						<FadeInStagger className="mt-16 grid gap-8 sm:grid-cols-2">
							{rights.map((right) => (
								<FadeInItem
									key={right.title}
									className="group flex h-full flex-col rounded-xl border border-white/20 bg-transparent p-6 transition-colors hover:border-white hover:bg-white/5"
								>
									<div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-white text-navy">
										<right.Icon size={22} />
									</div>
									<Heading as="h3" size="xl" tone="white" weight="semibold" className="mt-6">{right.title}</Heading>
									<Text size="lg" tone="white" className="mt-3 flex-1 leading-relaxed opacity-80">{right.description}</Text>
								</FadeInItem>
							))}
						</FadeInStagger>

						<FadeIn delay={0.3} className="mt-16 text-center">
							<a
								href="/documents/UCC_Anti_Sexual_Harassment_Policy.pdf"
								target="_blank"
								download
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-red px-8 py-4 text-base font-semibold text-white transition-all hover:bg-red-dark hover:-translate-y-0.5"
							>
								Download Full Policy PDF
							</a>
						</FadeIn>
					</div>
				</section>

				{/* ═══ Section 6: What Would You Do? Scenarios ═══ */}

			</div>

			<Footer />
		</>
	)
}
