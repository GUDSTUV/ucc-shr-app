import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isAdminLogin = pathname === '/admin/login'
  const isAdminSignup = pathname === '/admin/signup'

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  })

  if (isAdminLogin || isAdminSignup) {
    if (token) {
      if (token.role === 'SUPER_ADMIN' || token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.nextUrl.origin))
      }
      return NextResponse.redirect(new URL('/user/userDashboard', req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  const isProtectedRoute =
    pathname.startsWith('/user') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/report')

  if (!isProtectedRoute) {
    // If it's the public login page, and user is already logged in, redirect them.
    if (pathname === '/login' && token) {
      if (token.role === 'SUPER_ADMIN' || token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.nextUrl.origin))
      }
      return NextResponse.redirect(new URL('/user/userDashboard', req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  if (!token) {
    const loginUrl = new URL(pathname.startsWith('/admin') ? '/admin/login' : '/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && token.role !== 'SUPER_ADMIN' && token.role !== 'ADMIN') {
    const loginUrl = new URL('/admin/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  // Keep admin and client sessions scoped to their own route groups.
  if (pathname.startsWith('/user') && (token.role === 'SUPER_ADMIN' || token.role === 'ADMIN')) {
    const adminUrl = new URL('/admin', req.nextUrl.origin)
    return NextResponse.redirect(adminUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*', '/report/:path*', '/login'],
}
