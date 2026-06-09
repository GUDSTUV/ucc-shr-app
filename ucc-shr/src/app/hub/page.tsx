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

const ScenarioCards = dynamic(() => import('@/src/components/organisms/scenario-cards/scenario-cards').then(m => m.ScenarioCards))
const FlipCard = dynamic(() => import('@/src/components/molecules/flip-card/flip-card').then(m => m.FlipCard))
import { HeroCarousel } from './hero-carousel'
import { Phone, ShieldCheck, CheckCircle2 } from 'lucide-react'

/* ─── Page ─── */

export default async function HubPage() {
	const banners = await prisma.campaignBanner.findMany({
		where: { isActive: true },
		orderBy: { createdAt: 'desc' },
		take: 5,
	})

	return (
		<>
			<div className="bg-gray-50">
				{/* ═══ Section 1: Awareness Banner (Carousel) ═══ */}
				<HeroCarousel banners={banners} />

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
				<section className="py-16 lg:py-20">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<FadeIn className="text-center">
							<Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">Know the Signs</Text>
							<Heading size="3xl" tone="navy" className="mt-2 lg:text-4xl">What is Sexual Harassment?</Heading>
							<Text size="base" tone="muted" className="mx-auto mt-3 max-w-2xl">
								Sexual harassment is any unwelcome conduct of a sexual nature that makes a person feel offended, humiliated, or intimidated. It can happen to anyone, regardless of gender, and takes many forms.
							</Text>
						</FadeIn>

						<FadeInStagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
							{harassmentTypes.map((type) => (
								<FlipCard
									key={type.title}
									frontIcon={<type.Icon size={32} />}
									frontTitle={type.title}
									backDescription={type.description}
									backList={type.examples}
								/>
							))}
						</FadeInStagger>
					</div>
				</section>

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

						<FadeInStagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
							{rights.map((right) => (
								<FadeInItem
									key={right.title}
									className="rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-navy focus-within:ring-offset-2"
								>
									<div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white">
										<right.Icon size={20} />
									</div>
									<Heading as="h3" size="xl" tone="default" className="mt-4 text-base font-semibold">{right.title}</Heading>
									<Text size="sm" tone="muted" className="mt-2 leading-relaxed">{right.description}</Text>
								</FadeInItem>
							))}
						</FadeInStagger>
					</div>
				</section>

				{/* ═══ Section 5: Understanding Consent (F.R.I.E.S) ═══ */}
				<section className="py-16 lg:py-20">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<FadeIn className="text-center">
							<Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">Clear Boundaries</Text>
							<Heading size="3xl" tone="navy" className="mt-2 lg:text-4xl">Understanding Consent</Heading>
							<Text size="base" tone="muted" className="mx-auto mt-3 max-w-2xl">
								Consent is a clear, unambiguous, and voluntary agreement. It must be present in every interaction. Remember the F.R.I.E.S framework:
							</Text>
						</FadeIn>

						<FadeInStagger className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
							{consentPrinciples.map((item) => (
								<FadeInItem key={item.letter} className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
									<div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-xl font-bold text-white shadow-md">
										{item.letter}
									</div>
									<Heading as="h3" size="xl" tone="navy" className="mt-4 text-base">{item.title}</Heading>
									<Text size="sm" tone="muted" className="mt-2">{item.desc}</Text>
								</FadeInItem>
							))}
						</FadeInStagger>

						<FadeIn delay={0.2} className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-5 rounded-2xl bg-navy p-8 text-white shadow-xl sm:flex-row sm:items-center">
							<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10">
								<ShieldCheck size={28} className="text-white" />
							</div>
							<div className="text-center sm:text-left">
								<Heading as="h3" size="xl" tone="white" className="text-lg">Silence is NOT Consent</Heading>
								<Text size="sm" tone="white" className="mt-1 opacity-80">
									The absence of a &quot;no&quot; does not mean &quot;yes&quot;. Only a clear, enthusiastic &quot;yes&quot; constitutes consent.
								</Text>
							</div>
						</FadeIn>
					</div>
				</section>

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
							<FadeIn delay={0.2} className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-800 shadow-2xl ring-1 ring-white/10">
								{/* Placeholder for actual video player or iframe */}
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/50 backdrop-blur-sm">
									<div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-navy shadow-xl transition-transform hover:scale-110 cursor-pointer">
										<div className="ml-1 h-0 w-0 border-y-8 border-l-[12px] border-y-transparent border-l-navy" />
									</div>
									<Text as="span" size="sm" weight="medium" tone="white" className="mt-4 opacity-80">Play Campaign Video</Text>
								</div>
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
