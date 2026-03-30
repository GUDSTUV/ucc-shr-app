import { PublicLayout } from '@/src/components/templates/public-layout'
import { EventCard } from '@/src/components/organisms/event-card'
import { prisma } from '@/src/lib/prisma'

function formatEventDate(value: Date) {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(value)
}

export default async function EventsPage() {
	const events = await prisma.event.findMany({
		where: { published: true },
		orderBy: { startDate: 'asc' },
		take: 30,
		select: {
			id: true,
			title: true,
			image: true,
			startDate: true,
			venue: true,
			description: true,
		},
	})

	return (
		<PublicLayout>
			<section className="space-y-3">
				<h1 className="text-xl font-semibold text-navy">Awareness & Prevention Events</h1>
				<p className="text-sm text-gray-600">
					Campus events focused on sexual harassment prevention, consent education, and survivor support.
				</p>
			</section>

			<section className="mt-5 space-y-3">
				{events.map((event) => (
					<EventCard
						key={event.id}
						href={`/events/${event.id}`}
						imageUrl={event.image || '/icons/default-event.svg'}
						title={event.title}
						dateLabel={formatEventDate(event.startDate)}
						venue={event.venue}
						description={event.description}
					/>
				))}

				{events.length === 0 ? (
					<article className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-600 shadow-sm">
						No published events right now.
					</article>
				) : null}
			</section>
		</PublicLayout>
	)
}
