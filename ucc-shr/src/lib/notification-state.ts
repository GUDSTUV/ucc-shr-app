import { prisma } from '@/src/lib/prisma'

export type NotificationScope = 'USER' | 'ADMIN'

type NotificationStateRow = {
  lastSeenAt: Date | null
  clearedAt: Date | null
}

type NotificationStateDelegate = {
  findUnique: (args: {
    where: { userId_scope: { userId: string; scope: NotificationScope } }
    select: { lastSeenAt: true; clearedAt: true }
  }) => Promise<NotificationStateRow | null>
  upsert: (args: {
    where: { userId_scope: { userId: string; scope: NotificationScope } }
    update: { lastSeenAt?: Date; clearedAt?: Date }
    create: { userId: string; scope: NotificationScope; lastSeenAt?: Date; clearedAt?: Date }
  }) => Promise<NotificationStateRow>
}

type NotificationReadDelegate = {
  findMany: (args: {
    where: {
      userId: string
      scope: NotificationScope
      notificationId?: { in: string[] }
    }
    select: { notificationId: true }
  }) => Promise<Array<{ notificationId: string }>>
  upsert: (args: {
    where: {
      userId_scope_notificationId: {
        userId: string
        scope: NotificationScope
        notificationId: string
      }
    }
    update: Record<string, never>
    create: {
      userId: string
      scope: NotificationScope
      notificationId: string
    }
  }) => Promise<void>
  deleteMany: (args: {
    where: {
      userId: string
      scope: NotificationScope
    }
  }) => Promise<void>
}

type NotificationDismissedDelegate = {
  findMany: (args: {
    where: {
      userId: string
      scope: NotificationScope
      notificationId?: { in: string[] }
    }
    select: { notificationId: true }
  }) => Promise<Array<{ notificationId: string }>>
  upsert: (args: {
    where: {
      userId_scope_notificationId: {
        userId: string
        scope: NotificationScope
        notificationId: string
      }
    }
    update: Record<string, never>
    create: {
      userId: string
      scope: NotificationScope
      notificationId: string
    }
  }) => Promise<void>
  deleteMany: (args: {
    where: {
      userId: string
      scope: NotificationScope
    }
  }) => Promise<void>
}

function getDelegate() {
  const maybePrisma = prisma as unknown as { notificationState?: NotificationStateDelegate }
  return maybePrisma.notificationState
}

function getReadDelegate() {
  const maybePrisma = prisma as unknown as { notificationRead?: NotificationReadDelegate }
  return maybePrisma.notificationRead
}

function getDismissedDelegate() {
  const maybePrisma = prisma as unknown as { notificationDismissed?: NotificationDismissedDelegate }
  return maybePrisma.notificationDismissed
}

function isStaleNotificationModelError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()
  return (
    message.includes('notificationstate') ||
    message.includes('notificationread') ||
    message.includes('notificationdismissed') ||
    message.includes("cannot read properties of undefined (reading 'findunique')") ||
    message.includes('unknown model') ||
    message.includes('unknown field') ||
    message.includes('unknown argument')
  )
}

export async function getNotificationState(userId: string, scope: NotificationScope) {
  const delegate = getDelegate()
  if (!delegate) {
    return null
  }

  try {
    return await delegate.findUnique({
      where: {
        userId_scope: {
          userId,
          scope,
        },
      },
      select: {
        lastSeenAt: true,
        clearedAt: true,
      },
    })
  } catch (error: unknown) {
    if (isStaleNotificationModelError(error)) {
      return null
    }
    throw error
  }
}

export async function upsertNotificationState(
  userId: string,
  scope: NotificationScope,
  values: { lastSeenAt?: Date; clearedAt?: Date },
) {
  const delegate = getDelegate()
  if (!delegate) {
    return false
  }

  try {
    await delegate.upsert({
      where: {
        userId_scope: {
          userId,
          scope,
        },
      },
      update: values,
      create: {
        userId,
        scope,
        ...values,
      },
    })
    return true
  } catch (error: unknown) {
    if (isStaleNotificationModelError(error)) {
      return false
    }
    throw error
  }
}

export async function getNotificationReadIds(
  userId: string,
  scope: NotificationScope,
  notificationIds: string[],
) {
  if (notificationIds.length === 0) {
    return new Set<string>()
  }

  const delegate = getReadDelegate()
  if (!delegate) {
    return new Set<string>()
  }

  try {
    const rows = await delegate.findMany({
      where: {
        userId,
        scope,
        notificationId: {
          in: notificationIds,
        },
      },
      select: {
        notificationId: true,
      },
    })

    return new Set(rows.map((row) => row.notificationId))
  } catch (error: unknown) {
    if (isStaleNotificationModelError(error)) {
      return new Set<string>()
    }
    throw error
  }
}

export async function markNotificationRead(
  userId: string,
  scope: NotificationScope,
  notificationId: string,
) {
  const delegate = getReadDelegate()
  if (!delegate) {
    return false
  }

  try {
    await delegate.upsert({
      where: {
        userId_scope_notificationId: {
          userId,
          scope,
          notificationId,
        },
      },
      update: {},
      create: {
        userId,
        scope,
        notificationId,
      },
    })

    return true
  } catch (error: unknown) {
    if (isStaleNotificationModelError(error)) {
      return false
    }
    throw error
  }
}

export async function clearNotificationReads(
  userId: string,
  scope: NotificationScope,
) {
  const delegate = getReadDelegate()
  if (!delegate) {
    return false
  }

  try {
    await delegate.deleteMany({
      where: {
        userId,
        scope,
      },
    })
    return true
  } catch (error: unknown) {
    if (isStaleNotificationModelError(error)) {
      return false
    }
    throw error
  }
}

export async function getNotificationDismissedIds(
  userId: string,
  scope: NotificationScope,
  notificationIds: string[],
) {
  if (notificationIds.length === 0) {
    return new Set<string>()
  }

  const delegate = getDismissedDelegate()
  if (!delegate) {
    return new Set<string>()
  }

  try {
    const rows = await delegate.findMany({
      where: {
        userId,
        scope,
        notificationId: {
          in: notificationIds,
        },
      },
      select: {
        notificationId: true,
      },
    })

    return new Set(rows.map((row) => row.notificationId))
  } catch (error: unknown) {
    if (isStaleNotificationModelError(error)) {
      return new Set<string>()
    }
    throw error
  }
}

export async function dismissNotification(
  userId: string,
  scope: NotificationScope,
  notificationId: string,
) {
  const delegate = getDismissedDelegate()
  if (!delegate) {
    return false
  }

  try {
    await delegate.upsert({
      where: {
        userId_scope_notificationId: {
          userId,
          scope,
          notificationId,
        },
      },
      update: {},
      create: {
        userId,
        scope,
        notificationId,
      },
    })

    return true
  } catch (error: unknown) {
    if (isStaleNotificationModelError(error)) {
      return false
    }
    throw error
  }
}

export async function clearNotificationDismissed(
  userId: string,
  scope: NotificationScope,
) {
  const delegate = getDismissedDelegate()
  if (!delegate) {
    return false
  }

  try {
    await delegate.deleteMany({
      where: {
        userId,
        scope,
      },
    })
    return true
  } catch (error: unknown) {
    if (isStaleNotificationModelError(error)) {
      return false
    }
    throw error
  }
}
