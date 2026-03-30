import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isAdminLogin = pathname === '/admin/login'
  const isAdminSignup = pathname === '/admin/signup'

  if (isAdminLogin || isAdminSignup) {
    return NextResponse.next()
  }

  const isProtectedRoute =
    pathname.startsWith('/user') ||
    pathname.startsWith('/admin')

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const loginUrl = new URL(pathname.startsWith('/admin') ? '/admin/login' : '/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && token.role !== 'SUPER_ADMIN') {
    const loginUrl = new URL('/admin/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  // Keep admin and client sessions scoped to their own route groups.
  if (pathname.startsWith('/user') && token.role === 'SUPER_ADMIN') {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*'],
}
