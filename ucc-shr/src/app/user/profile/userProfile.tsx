import Link from 'next/link'
import Image from 'next/image'
import {
	ArrowLeft,
	Bell,
	Bookmark,
	ChevronRight,
	History,
	LogOut,
	Moon,
	Shield,
} from 'lucide-react'

type ProfileItemProps = {
	icon: React.ReactNode
	title: string
	subtitle: string
	showDivider?: boolean
	trailing?: React.ReactNode
	href?: string
}

function ProfileItem({
	icon,
	title,
	subtitle,
	showDivider = true,
	trailing,
	href,
}: ProfileItemProps) {
	const content = (
		<div className={`flex items-center gap-4 px-4 py-4 ${showDivider ? 'border-b border-gray-100' : ''}`}>
			<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-light text-navy">
				{icon}
			</div>

			<div className="min-w-0 flex-1">
				<p className="text-sm font-semibold text-gray-900">{title}</p>
				<p className="truncate text-xs text-gray-500 mt-0.5">{subtitle}</p>
			</div>

			{trailing ?? <ChevronRight className="h-5 w-5 text-gray-300" />}
		</div>
	)

	return href ? <Link href={href}>{content}</Link> : content
}

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
			{children}
		</h2>
	)
}

export default function UserProfile({ name, email }: { name?: string; email?: string }) {
	const isGuest = !name || !email

	return (
		<div className="mx-auto min-h-screen max-w-md bg-gray-50 pb-8 font-sans">
			<header className="sticky top-0 z-10 flex items-center border-b border-gray-100 bg-white px-4 py-4">
				<Link
					href="/user/userDashboard"
					aria-label="Go back"
					className="rounded-full p-1 text-gray-900 transition hover:bg-gray-100"
				>
					<ArrowLeft className="h-5 w-5" />
				</Link>

				<h1 className="mx-auto pr-8 text-lg font-semibold text-gray-900">Profile</h1>
			</header>

			<main className="px-4 pt-8">
				{isGuest ? (
					<section className="space-y-4">
						<div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-light">
								<svg className="h-8 w-8 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							</div>
							<h2 className="mt-3 text-center text-base font-semibold text-gray-900">Not Signed In</h2>
							<p className="mt-1 text-center text-xs text-gray-500">Log in or create an account to see your profile</p>
						</div>

						<div className="space-y-3">
							<Link href="/login" className="block">
								<button
									type="button"
									className="w-full rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-dark"
								>
									Log In
								</button>
							</Link>
							<Link href="/signup" className="block">
								<button
									type="button"
									className="w-full rounded-xl border border-navy bg-white px-4 py-3 text-sm font-semibold text-navy transition hover:bg-navy-light"
								>
									Sign Up
								</button>
							</Link>
						</div>
					</section>
				) : (
					<>
						<section className="flex flex-col items-center">
							<div className="relative">
								<div className="rounded-full border-4 border-white shadow-sm">
									<Image
										src="/icons/avatar-placeholder.svg"
										alt={`${name} profile photo`}
										width={120}
										height={120}
										className="h-30 w-30 rounded-full object-cover"
										priority
									/>
								</div>

								<button
									type="button"
									aria-label="Edit profile photo"
									className="absolute bottom-0 right-0 grid h-10 w-10 place-content-center rounded-full border-4 border-gray-50 bg-navy text-white shadow-md transition hover:bg-navy/90"
								>
									<svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
										<path d="M4 20h4l10-10a2.121 2.121 0 0 0-3-3L5 17v3z" />
									</svg>
								</button>
							</div>

							<h2 className="mt-5 text-center text-2xl font-bold text-gray-900">{name}</h2>
							<p className="mt-1 text-center text-sm text-gray-500">{email}</p>

							<div className="mt-6 w-full">
								<button
									type="button"
									className="w-full rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy/90"
								>
									Edit Profile
								</button>
							</div>
						</section>

						<section className="mt-8 space-y-3">
							<SectionTitle>Activity</SectionTitle>
							<div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
								<ProfileItem
									icon={<History className="h-5 w-5" />}
									title="Report History"
									subtitle="View your submitted cases"
									href="/user/userReports"
								/>
								<ProfileItem
									icon={<Bookmark className="h-5 w-5" />}
									title="Saved Items"
									subtitle="Resources and articles"
									showDivider={false}
								/>
							</div>
						</section>

						<section className="mt-8 space-y-3">
							<SectionTitle>Preferences</SectionTitle>
							<div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
								<ProfileItem
									icon={<Bell className="h-5 w-5" />}
									title="Notifications"
									subtitle="Manage alerts and updates"
									href="/user/notifications"
								/>
								<ProfileItem
									icon={<Shield className="h-5 w-5" />}
									title="Privacy & Security"
									subtitle="Data usage and permissions"
								/>
								<ProfileItem
									icon={<Moon className="h-5 w-5" />}
									title="Dark Mode"
									subtitle="Automatic switching"
									showDivider={false}
									trailing={
										<button
											type="button"
											aria-label="Toggle dark mode"
											className="relative h-8 w-14 rounded-full bg-gray-200 transition hover:bg-gray-300"
										>
											<span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition" />
										</button>
									}
								/>
							</div>
						</section>

						<button
							type="button"
							className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
						>
							<LogOut className="h-4 w-4" />
							Logout
						</button>
					</>
				)}

				<footer className="mt-12 py-8 text-center">
					<p className="text-xs text-gray-400">UCC-SHR Mobile PWA v2.4.0</p>
					<p className="mt-1 text-xs text-gray-400">© 2026 CEGRAD-UCC</p>
				</footer>
			</main>
		</div>
	)
}
