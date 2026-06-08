import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth/auth'
import dynamic from 'next/dynamic'
import { Footer } from '@/src/components/organisms/Footer'
import { AnimatedCounter } from '@/src/components/molecules/animated-counter/animated-counter'
import { FadeIn, FadeInStagger, FadeInItem } from '@/src/components/atoms/fade-in'
import Link from 'next/link'

const HubClient = dynamic(() => import('./hub-client').then(m => m.HubClient))
const ScenarioCards = dynamic(() => import('@/src/components/organisms/scenario-cards/scenario-cards').then(m => m.ScenarioCards))
import {
	Flag,
	Phone,
	ShieldCheck,
	Lock,
	Clock,
	Users,
	MessageSquare,
	Eye,
	Hand,
	Smartphone,
	Scale,
	FileText,
	AlertTriangle,
	CheckCircle2,
} from 'lucide-react'

const DEFAULT_ARTICLE_IMAGE = '/icons/default-article.svg'
const DEFAULT_EVENT_IMAGE = '/icons/default-event.svg'

/* ─── Static awareness data ─── */

const stats = [
	{ icon: AlertTriangle, value: '4 Types', label: 'of harassment recognized by UCC policy' },
	{ icon: Lock, value: '100%', label: 'Confidential reporting guaranteed' },
	{ icon: Clock, value: '24/7', label: 'Support available through hotlines' },
	{ icon: Users, value: '3 Steps', label: 'Simple reporting process' },
]

const harassmentTypes = [
	{
		Icon: MessageSquare,
		title: 'Verbal Harassment',
		description: 'Unwanted comments, sexual demands, threats, and derogatory language targeting individuals.',
		examples: ['Inappropriate jokes or remarks', 'Sexual comments about appearance', 'Verbal threats or intimidation'],
	},
	{
		Icon: Eye,
		title: 'Non-Verbal Harassment',
		description: 'Unwanted gestures, intrusive staring, stalking, or displaying offensive material.',
		examples: ['Leering or persistent staring', 'Offensive gestures or signs', 'Stalking behaviour on/off campus'],
	},
	{
		Icon: Hand,
		title: 'Physical Harassment',
		description: 'Any unwanted physical contact or physical intimidation, from touching to assault.',
		examples: ['Unwanted touching or groping', 'Blocking someone\'s movement', 'Any form of physical assault'],
	},
	{
		Icon: Smartphone,
		title: 'Digital Harassment',
		description: 'Harassment carried out through messages, social media, images, or online platforms.',
		examples: ['Sending explicit messages or images', 'Non-consensual sharing of images', 'Online threats or cyberstalking'],
	},
]

const rights = [
	{
		Icon: ShieldCheck,
		title: 'Right to Safety',
		description: 'Every student and staff member has the right to a safe learning and working environment, free from all forms of sexual harassment.',
	},
	{
		Icon: Lock,
		title: 'Right to Confidentiality',
		description: 'Your identity and the details of your report are kept strictly confidential. Only authorized CEGRAD personnel handle your case.',
	},
	{
		Icon: Scale,
		title: 'Right to Fair Process',
		description: 'All reports are investigated impartially. Both the complainant and the respondent are entitled to a fair hearing and due process.',
	},
	{
		Icon: FileText,
		title: 'Right to Support',
		description: 'You are entitled to counselling, academic accommodations, and protective measures throughout and after the reporting process.',
	},
]

const consentPrinciples = [
	{ letter: 'F', title: 'Freely Given', desc: 'Consent must be given without pressure, manipulation, or being under the influence.' },
	{ letter: 'R', title: 'Reversible', desc: 'Anyone can change their mind at any time, even if they have said yes before.' },
	{ letter: 'I', title: 'Informed', desc: 'You must know exactly what you are agreeing to. Deception invalidates consent.' },
	{ letter: 'E', title: 'Enthusiastic', desc: 'Consent should be a clear, enthusiastic yes. Silence or reluctance is not consent.' },
	{ letter: 'S', title: 'Specific', desc: 'Saying yes to one thing does not mean saying yes to everything else.' },
]

const policyPoints = [
	'The University of Cape Coast strictly prohibits all forms of sexual and gender-based harassment.',
	'The UCC Anti-Sexual Harassment Policy applies to all students, staff, faculty, and visitors on campus.',
	'Any person who experiences or witnesses harassment is encouraged to report it without fear of retaliation.',
	'CEGRAD is the designated body responsible for receiving, investigating, and resolving all reports of sexual harassment.',
	'Perpetrators face disciplinary action ranging from warnings to dismissal or expulsion, depending on the severity.',
]

/* ─── Hub item types ─── */

interface HubItem {
	id: string
	resourceType: 'ARTICLE' | 'EVENT'
	resourceId: string
	href: string
	title: string
	excerpt: string
	category: 'Awareness' | 'Events' | 'Rights'
	readTime: string
	imageUrl?: string
	dateLabel?: string
	timeLabel?: string
	isRegistration?: boolean
	imageTheme: string
	isSaved: boolean
}

/* ─── Page ─── */

export default async function HubPage() {
	const session = await auth()

	const [articles, events, saved] = await Promise.all([
		prisma.article.findMany({
			where: { published: true },
			orderBy: { updatedAt: 'desc' },
			take: 30,
			select: {
				id: true,
				slug: true,
				title: true,
				category: true,
				content: true,
				coverImage: true,
				updatedAt: true,
			},
		}),
		prisma.event.findMany({
			where: { published: true },
			orderBy: { startDate: 'desc' },
			take: 30,
			select: {
				id: true,
				title: true,
				description: true,
				image: true,
				startDate: true,
			},
		}),
		session?.user
			? prisma.savedResource.findMany({
					where: { userId: session.user.id },
					select: { resourceType: true, resourceId: true },
				})
			: Promise.resolve([]),
	])

	const savedKeys = new Set(saved.map((entry) => `${entry.resourceType}:${entry.resourceId}`))

	const articleItems: Array<HubItem & { sortAt: number }> = articles.map((article) => {
		const category = article.category === 'Rights' ? 'Rights' : 'Awareness'
		const contentText = typeof article.content === 'string' ? article.content : JSON.stringify(article.content)
		const key = `ARTICLE:${article.id}`

		return {
			id: key,
			resourceType: 'ARTICLE',
			resourceId: article.id,
			href: `/hub/${article.slug}`,
			title: article.title,
			excerpt: contentText.slice(0, 140) || 'Read the latest CEGRAD update.',
			category,
			readTime: '3 min read',
			imageUrl: article.coverImage || DEFAULT_ARTICLE_IMAGE,
			imageTheme:
				category === 'Rights' ? 'from-red/10 via-red/5 to-white' : 'from-navy-light via-white to-gray-100',
			isRegistration: false,
			isSaved: savedKeys.has(key),
			sortAt: article.updatedAt.getTime(),
		}
	})

	const eventItems: Array<HubItem & { sortAt: number }> = events.map((event) => {
		const key = `EVENT:${event.id}`

		return {
			id: key,
			resourceType: 'EVENT',
			resourceId: event.id,
			href: `/events/${event.id}`,
			title: event.title,
			excerpt: `${event.description.slice(0, 120)}${event.description.length > 120 ? '...' : ''}`,
			category: 'Events',
			readTime: 'Event',
			imageUrl: event.image || DEFAULT_EVENT_IMAGE,
			dateLabel: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(event.startDate).toUpperCase(),
			timeLabel: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(event.startDate),
			isRegistration: true,
			imageTheme: 'from-navy-dark via-navy to-gray-900',
			isSaved: savedKeys.has(key),
			sortAt: event.startDate.getTime(),
		}
	})

	const items: HubItem[] = [...articleItems, ...eventItems]
		.sort((a, b) => b.sortAt - a.sortAt)
		.slice(0, 30)

	return (
		<>
			<div className="bg-gray-50">
				{/* ═══ Section 1: Awareness Banner ═══ */}
				<section className="bg-navy">
					<FadeIn className="mx-auto max-w-7xl px-6 py-14 text-center lg:px-8 lg:py-20">
						<span className="text-xs font-semibold uppercase tracking-widest text-white/60">
							CEGRAD — University of Cape Coast
						</span>
						<h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
							Awareness Hub
						</h1>
						<p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
							Learn about sexual harassment, understand your rights, and access educational resources. 
							This hub provides the information you need to recognize, report, and prevent harassment at UCC.
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link
								href="/report"
								className="inline-flex items-center gap-2 rounded-xl bg-red px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-red/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy active:scale-[0.98]"
							>
								<Flag size={18} />
								Report an Incident
							</Link>
							<Link
								href="/help"
								className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy active:scale-[0.98]"
							>
								<Phone size={18} />
								Get Help Now
							</Link>
						</div>
					</FadeIn>
				</section>

				{/* ═══ Section 2: Quick Stats ═══ */}
				<section className="border-b border-gray-100 bg-white">
					<div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
						{stats.map((stat) => (
							<div key={stat.value} className="flex flex-col items-center gap-2 bg-white px-6 py-8 text-center">
								<stat.icon size={22} className="text-navy" />
								<span className="text-2xl font-bold text-navy">
									<AnimatedCounter value={stat.value} />
								</span>
								<span className="text-xs leading-snug text-gray-500">{stat.label}</span>
							</div>
						))}
					</div>
				</section>

				{/* ═══ Section 3: What is Sexual Harassment ═══ */}
				<section className="py-16 lg:py-20">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<FadeIn className="text-center">
							<span className="text-xs font-semibold uppercase tracking-widest text-navy">Know the Signs</span>
							<h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">What is Sexual Harassment?</h2>
							<p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
								Sexual harassment is any unwelcome conduct of a sexual nature that makes a person feel offended, humiliated, or intimidated. It can happen to anyone, regardless of gender, and takes many forms.
							</p>
						</FadeIn>

						<FadeInStagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
							{harassmentTypes.map((type) => (
								<FadeInItem
									key={type.title}
									className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-navy focus-within:ring-offset-2"
								>
									<div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-light text-navy">
										<type.Icon size={20} />
									</div>
									<h3 className="mt-4 text-base font-semibold text-gray-900">{type.title}</h3>
									<p className="mt-1.5 text-sm leading-relaxed text-gray-600">{type.description}</p>
									<ul className="mt-3 space-y-1">
										{type.examples.map((ex) => (
											<li key={ex} className="flex items-start gap-2 text-xs text-gray-500">
												<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
												<span className="leading-relaxed">{ex}</span>
											</li>
										))}
									</ul>
								</FadeInItem>
							))}
						</FadeInStagger>
					</div>
				</section>

				{/* ═══ Section 4: Know Your Rights ═══ */}
				<section className="bg-navy-light py-16 lg:py-20">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<FadeIn className="text-center">
							<span className="text-xs font-semibold uppercase tracking-widest text-navy">Your Protections</span>
							<h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">Know Your Rights</h2>
							<p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
								As a member of the UCC community, you are protected by university policies and national laws. Here are your fundamental rights.
							</p>
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
									<h3 className="mt-4 text-base font-semibold text-gray-900">{right.title}</h3>
									<p className="mt-2 text-sm leading-relaxed text-gray-600">{right.description}</p>
								</FadeInItem>
							))}
						</FadeInStagger>
					</div>
				</section>

				{/* ═══ Section 5: Understanding Consent (F.R.I.E.S) ═══ */}
				<section className="py-16 lg:py-20">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<FadeIn className="text-center">
							<span className="text-xs font-semibold uppercase tracking-widest text-navy">Clear Boundaries</span>
							<h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">Understanding Consent</h2>
							<p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
								Consent is a clear, unambiguous, and voluntary agreement. It must be present in every interaction. Remember the F.R.I.E.S framework:
							</p>
						</FadeIn>

						<FadeInStagger className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
							{consentPrinciples.map((item) => (
								<FadeInItem key={item.letter} className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
									<div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-xl font-bold text-white shadow-md">
										{item.letter}
									</div>
									<h3 className="mt-4 text-base font-bold text-navy">{item.title}</h3>
									<p className="mt-2 text-sm text-gray-600">{item.desc}</p>
								</FadeInItem>
							))}
						</FadeInStagger>

						<FadeIn delay={0.2} className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-5 rounded-2xl bg-navy p-8 text-white shadow-xl sm:flex-row sm:items-center">
							<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10">
								<ShieldCheck size={28} className="text-white" />
							</div>
							<div className="text-center sm:text-left">
								<h3 className="text-lg font-bold">Silence is NOT Consent</h3>
								<p className="mt-1 text-sm text-white/80">
									The absence of a &quot;no&quot; does not mean &quot;yes&quot;. Only a clear, enthusiastic &quot;yes&quot; constitutes consent.
								</p>
							</div>
						</FadeIn>
					</div>
				</section>

				{/* ═══ Section 6: What Would You Do? Scenarios ═══ */}
				<ScenarioCards />

				{/* ═══ Section 7: UCC Policy ═══ */}
				<section className="border-t border-gray-100 bg-white py-16 lg:py-20">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<FadeIn className="mx-auto max-w-3xl">
							<div className="text-center">
								<span className="text-xs font-semibold uppercase tracking-widest text-navy">Institutional Framework</span>
								<h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">UCC Policy on Sexual Harassment</h2>
								<p className="mt-3 text-base text-gray-600">
									The University of Cape Coast has a comprehensive policy framework to address sexual and gender-based violence. Key provisions include:
								</p>
							</div>

							<ul className="mt-8 space-y-4">
								{policyPoints.map((point, i) => (
									<li key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100/80">
										<CheckCircle2 size={20} className="mt-0.5 shrink-0 text-navy" />
										<span className="text-sm leading-relaxed text-gray-700">{point}</span>
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

				{/* ═══ Section 7: Articles & Events Feed ═══ */}
				<section className="border-t border-gray-100 py-16 lg:py-20">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mb-8 text-center">
							<span className="text-xs font-semibold uppercase tracking-widest text-navy">Stay Informed</span>
							<h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">Posts & Events</h2>
							<p className="mt-3 text-base text-gray-600">
								Read the latest articles, find upcoming events, and access educational resources from CEGRAD.
							</p>
						</div>
						<HubClient items={items} isAuthenticated={Boolean(session?.user)} />
					</div>
				</section>
			</div>

			<Footer />
		</>
	)
}
