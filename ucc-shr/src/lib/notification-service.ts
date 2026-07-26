import { prisma } from '@/src/lib/prisma'
import { Role } from '@prisma/client'
import {
  getNotificationState,
  getNotificationReadIds,
  getNotificationDismissedIds,
} from '@/src/lib/notification-state'
import { belongsToUser, parseReportNotes } from '@/src/lib/auth/report-access'
import { isCaseOfficerRole } from '@/src/lib/auth/roles'

export type AppNotification = {
  id: string
  notificationId: string
  title: string
  message: string
  time: Date
  unread: boolean
  atMs: number
  link: string
}

export async function getAdminNotifications(userId: string, role: string) {
  const isCaseOfficer = isCaseOfficerRole(role)
  
  // 1. Fetch data
  const reportsRaw = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { id: true, code: true, type: true, createdAt: true, status: true, notes: true },
  })

  // Case officers only see assigned reports
  const reportsData = isCaseOfficer 
    ? reportsRaw.filter(r => {
        const notes = parseReportNotes(r.notes)
        return (notes.counsellorId === userId || notes.investigatorId === userId)
      })
    : reportsRaw

  const reportIds = reportsData.map(r => r.id)

  const messagesData = await prisma.message.findMany({
    where: { reportId: { in: reportIds }, User: { role: Role.STAFF } },
    include: { Report: true, User: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  // 2. Build notifications array
  const reportNotifications: AppNotification[] = []
  const messageNotifications: AppNotification[] = []

  // Add reports
  for (const report of reportsData) {
    reportNotifications.push({
      id: report.id,
      notificationId: `report:${report.id}`,
      title: `New Report Submitted`,
      message: `A new ${report.type} report (${report.code}) was received.`,
      time: report.createdAt,
      atMs: report.createdAt.getTime(),
      unread: false,
      link: `/admin/reports/${report.code}`,
    })

    if (isCaseOfficer) {
      reportNotifications.push({
        id: `assign-${report.id}`,
        notificationId: `assign:${report.id}`,
        title: `Case Assigned`,
        message: `Report ${report.code} has been assigned to you.`,
        time: report.createdAt, // Fallback to createdAt if no assignment date exists
        atMs: report.createdAt.getTime(),
        unread: false,
        link: `/admin/reports/${report.code}`,
      })
    }
  }

  // Add messages
  for (const msg of messagesData) {
    messageNotifications.push({
      id: msg.id,
      notificationId: `message:${msg.id}`,
      title: `New Message on ${msg.Report.code}`,
      message: `Reporter: ${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}`,
      time: msg.createdAt,
      atMs: msg.createdAt.getTime(),
      unread: false,
      link: `/admin/reports/${msg.Report.code}?tab=messages`,
    })
  }

  return applyNotificationState(userId, 'ADMIN', reportNotifications, messageNotifications)
}

export async function getUserNotifications(userId: string, userEmail: string | null) {
  const reportsData = await prisma.report.findMany({
    select: { id: true, code: true, notes: true },
  })

  const myReports = reportsData.filter(r => belongsToUser(r.notes, userId, userEmail))
  const reportIds = myReports.map(r => r.id)

  const messagesData = await prisma.message.findMany({
    where: { reportId: { in: reportIds }, User: { role: { not: Role.STAFF } } },
    include: { Report: true, User: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const reportNotifications: AppNotification[] = []
  const messageNotifications: AppNotification[] = []

  // Add status updates
  for (const report of myReports) {
    const notes = parseReportNotes(report.notes)
    const allUpdates = Array.isArray(notes.adminUpdates) ? notes.adminUpdates : []
    const updates = allUpdates.filter((u) => !u.isInternal)

    for (const update of updates) {
      const atMs = new Date(update.at).getTime()
      reportNotifications.push({
        id: update.id,
        notificationId: `update:${update.id}`,
        title: `Report ${report.code} updated`,
        message: update.message,
        time: new Date(update.at),
        atMs,
        unread: false,
        link: `/user/userReports/${report.code}`,
      })
    }
  }

  // Add messages
  for (const msg of messagesData) {
    messageNotifications.push({
      id: msg.id,
      notificationId: `message:${msg.id}`,
      title: `New Message from Case Officer`,
      message: `${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}`,
      time: msg.createdAt,
      atMs: msg.createdAt.getTime(),
      unread: false,
      link: `/user/userReports/${msg.Report.code}?tab=messages`,
    })
  }

  const state = await applyNotificationState(userId, 'USER', reportNotifications, messageNotifications)
  
  const allNotifications = [...state.reports, ...state.messages].sort((a, b) => b.atMs - a.atMs)
  const totalUnread = state.unreadReportsCount + state.unreadMessagesCount

  return { notifications: allNotifications, unreadCount: totalUnread }
}

export async function getUnreadMessageCountsByReport(userId: string, scope: 'USER' | 'ADMIN', reportIds: string[]) {
  if (reportIds.length === 0) return {}

  const messagesData = await prisma.message.findMany({
    where: { 
      reportId: { in: reportIds }, 
      User: scope === 'USER' ? { role: { not: 'STAFF' } } : { role: 'STAFF' }
    },
    select: { id: true, reportId: true }
  })

  if (messagesData.length === 0) return {}

  const messageIds = messagesData.map(m => `message:${m.id}`)
  const readIds = await getNotificationReadIds(userId, scope, messageIds)

  const counts: Record<string, number> = {}
  for (const msg of messagesData) {
    if (!readIds.has(`message:${msg.id}`)) {
      counts[msg.reportId] = (counts[msg.reportId] || 0) + 1
    }
  }

  return counts
}

async function applyNotificationState(userId: string, scope: 'USER' | 'ADMIN', reportNotifications: AppNotification[], messageNotifications: AppNotification[]) {
  const state = await getNotificationState(userId, scope)
  const clearedAtMs = state?.clearedAt?.getTime() ?? 0
  const lastSeenAtMs = state?.lastSeenAt?.getTime() ?? 0

  const allIds = [...reportNotifications.map(n => n.notificationId), ...messageNotifications.map(n => n.notificationId)]
  
  const [readIds, dismissedIds] = await Promise.all([
    getNotificationReadIds(userId, scope, allIds),
    getNotificationDismissedIds(userId, scope, allIds),
  ])

  for (const n of reportNotifications) {
    n.unread = n.atMs > lastSeenAtMs && !readIds.has(n.notificationId)
  }
  
  for (const n of messageNotifications) {
    n.unread = !readIds.has(n.notificationId)
  }

  reportNotifications.sort((a, b) => b.atMs - a.atMs)
  messageNotifications.sort((a, b) => b.atMs - a.atMs)

  const visibleReports = reportNotifications.filter(n => n.atMs > clearedAtMs && !dismissedIds.has(n.notificationId))
  const visibleMessages = messageNotifications.filter(n => n.atMs > clearedAtMs && !dismissedIds.has(n.notificationId))
  
  const unreadReportsCount = visibleReports.filter(n => n.unread).length
  const unreadMessagesCount = visibleMessages.filter(n => n.unread).length

  return { 
    reports: visibleReports, 
    messages: visibleMessages, 
    unreadReportsCount, 
    unreadMessagesCount 
  }
}

export async function markAllReportNotificationsAsRead(userId: string, role: string, reportId: string) {
  const scope = role === 'STAFF' || role === 'USER' ? 'USER' : 'ADMIN'
  
  const messages = await prisma.message.findMany({
    where: { reportId },
    select: { id: true },
  })
  
  const idsToMark = [`report:${reportId}`, `update:${reportId}`, `assign:${reportId}`]
  messages.forEach(m => idsToMark.push(`message:${m.id}`))
  
  const { markNotificationRead } = await import('@/src/lib/notification-state')
  
  // Process sequentially to prevent connection pool exhaustion
  for (const id of idsToMark) {
    await markNotificationRead(userId, scope, id)
  }
}
