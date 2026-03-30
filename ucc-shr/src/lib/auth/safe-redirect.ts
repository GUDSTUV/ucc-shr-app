export function isSafeInternalPath(path: string | null | undefined): path is string {
  if (!path) return false
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (/[\r\n]/.test(path)) return false
  return true
}

export function resolveSafeCallback(
  callbackUrl: string | null | undefined,
  fallback: string,
  options?: { requirePrefix?: string }
) {
  if (!isSafeInternalPath(callbackUrl)) {
    return fallback
  }

  if (options?.requirePrefix && !callbackUrl.startsWith(options.requirePrefix)) {
    return fallback
  }

  return callbackUrl
}
