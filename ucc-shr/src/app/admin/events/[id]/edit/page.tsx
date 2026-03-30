import { notFound } from 'next/navigation'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { EditEventForm } from './editEventForm'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: PageProps) {
  await requireSuperAdmin()

  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      venue: true,
      startDate: true,
      endDate: true,
      capacity: true,
      published: true,
    },
  })

  if (!event) {
    notFound()
  }

  return <EditEventForm event={{ ...event, image: event.image ?? '/icons/default-event.svg' }} />
}
