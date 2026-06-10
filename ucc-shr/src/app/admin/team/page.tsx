import { AdminLayout } from '@/src/components/templates/admin-layout'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { TeamTable } from './team-table'

export default async function AdminTeamPage() {
  const session = await requireSuperAdmin()

  const admins = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'SUPER_ADMIN', 'SUSPENDED'] } },
    orderBy: { name: 'asc' }
  })

  // Format dates for client component
  const serializedAdmins = admins.map(admin => ({
    id: admin.id,
    name: admin.name || '',
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt,
    lastLoginAt: admin.lastLoginAt
  }))

  return (
    <AdminLayout 
      title="Team Management" 
      description="Manage access to the admin portal. Only Super Admins can promote or suspend accounts."
    >
      <TeamTable admins={serializedAdmins} currentUserId={session.user.id} />
    </AdminLayout>
  )
}
