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

import { HeroCarousel } from './hero-carousel'
import { Phone, CheckCircle2 } from 'lucide-react'
import { ConsentSection } from '@/src/components/organisms/consent-section/consent-section'
import { HarassmentTypesSection } from '@/src/components/organisms/harassment-types'
const ScenarioCards = dynamic(() => import('@/src/components/organisms/scenario-cards/scenario-cards').then(m => m.ScenarioCards))

/* ─── Page ─── */

export default async function HubPage() {
	const contentRecords = await prisma.siteContent.findMany({
		where: { key: { in: ['awarenessBanner', 'awarenessVideoUrl'] } }
	})

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
					<div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
						{stats.map((stat) => (
							<div key={stat.value} className="flex flex-col items-center gap-2 bg-white px-6 py-8 text-center">
								<stat.icon size={22} className="text-navy" />
								<Text as="span" size="lg" weight="bold" tone="navy" className="text-2xl">
									<AnimatedCounter value={stat.value} />
								</Text>
								<Text as="span" size="xs" tone="muted" className="leading-snug">{stat.label}</Text>
							</div>
						))}
					</div>
				</section>

				{/* ═══ Section 3: What is Sexual Harassment ═══ */}
				<HarassmentTypesSection />

				{/* ═══ Section 4: Know Your Rights ═══ */}
				<section className="bg-navy-light py-16 lg:py-20">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<FadeIn className="text-center">
							<Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">Your Protections</Text>
							<Heading size="3xl" tone="navy" className="mt-2 lg:text-4xl">Know Your Rights</Heading>
							<Text size="base" tone="muted" className="mx-auto mt-3 max-w-2xl">
								As a member of the UCC community, you are protected by university policies and national laws. Here are your fundamental rights.
							</Text>
						</FadeIn>

						<FadeInStagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{rights.map((right) => (
								<FadeInItem
									key={right.title}
									className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 sm:p-8 transition-colors hover:border-navy hover:bg-gray-50"
								>
									<div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-navy text-white">
										<right.Icon size={22} />
									</div>
									<Heading as="h3" size="lg" tone="navy" weight="semibold" className="mt-6 text-base">{right.title}</Heading>
									<Text size="sm" tone="muted" className="mt-2 flex-1 leading-relaxed">{right.description}</Text>
								</FadeInItem>
							))}
						</FadeInStagger>
					</div>
				</section>

				{/* ═══ Section 5: Understanding Consent (F.R.I.E.S) ═══ */}
				<ConsentSection />

				{/* ═══ Section 6: What Would You Do? Scenarios ═══ */}
				<ScenarioCards />

				{/* ═══ Section 6.5: Featured Campaign Media ═══ */}
				<section className="bg-navy-dark py-16 lg:py-20 text-white">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
							<FadeIn>
								<Text as="span" size="xs" weight="semibold" tone="white" className="uppercase tracking-widest text-red-light">Featured Campaign</Text>
								<Heading size="3xl" tone="white" className="mt-2 lg:text-4xl">Break The Silence</Heading>
								<Text size="base" tone="white" className="mt-4 leading-relaxed text-gray-300">
									Watch our latest campaign video on recognizing and preventing non-verbal harassment on campus. Your voice matters, and together we can create a safer environment for everyone at the University of Cape Coast.
								</Text>
								<div className="mt-8">
									<Link
										href="/report"
										className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gray-100"
									>
										Report an Incident Today
									</Link>
								</div>
							</FadeIn>
							<FadeIn delay={0.2} className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-800 border border-white/10 group">
								{customVideo ? (
									customVideo.includes('youtube.com') || customVideo.includes('youtu.be') ? (
										<iframe
											src={customVideo.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
											className="absolute inset-0 h-full w-full border-0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										/>
									) : (
										<video key={customVideo} controls className="absolute inset-0 h-full w-full object-cover">
											<source src={customVideo} type="video/mp4" />
										</video>
									)
								) : (
									<div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/50 backdrop-blur-sm">
										<div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-navy shadow-xl transition-transform group-hover:scale-110 cursor-pointer">
											<div className="ml-1 h-0 w-0 border-y-8 border-l-[12px] border-y-transparent border-l-navy" />
										</div>
										<Text as="span" size="sm" weight="medium" tone="white" className="mt-4 opacity-80">Play Campaign Video</Text>
									</div>
								)}
							</FadeIn>
						</div>
					</div>
				</section>

				{/* ═══ Section 7: UCC Policy ═══ */}
				<section className="border-t border-gray-100 bg-white py-16 lg:py-20">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<FadeIn className="mx-auto max-w-3xl">
							<div className="text-center">
								<Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">Institutional Framework</Text>
								<Heading size="3xl" tone="navy" className="mt-2 lg:text-4xl">UCC Policy on Sexual Harassment</Heading>
								<Text size="base" tone="muted" className="mt-3">
									The University of Cape Coast has a comprehensive policy framework to address sexual and gender-based violence. Key provisions include:
								</Text>
							</div>

							<ul className="mt-8 space-y-4">
								{policyPoints.map((point, i) => (
									<li key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100/80">
										<CheckCircle2 size={20} className="mt-0.5 shrink-0 text-navy" />
										<Text as="span" size="sm" tone="default" className="leading-relaxed text-gray-700">{point}</Text>
									</li>
								))}
							</ul>

							<div className="mt-8 text-center">
								<Link
									href="/help"
									className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 active:scale-[0.98]"
								>
									<Phone size={16} />
									Contact CEGRAD for More Information
								</Link>
							</div>
						</FadeIn>
					</div>
				</section>
			</div>

			<Footer />
		</>
	)
}
