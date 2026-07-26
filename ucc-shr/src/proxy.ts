import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAdminRole } from './lib/auth/roles'

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isAdminLogin = pathname === '/admin/login'
  const isAdminSignup = pathname === '/admin/signup'

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

  let token = await getToken({ req, secret })

  if (!token) {
    token = await getToken({
      req,
      secret,
      secureCookie: true,
      salt: '__Secure-authjs.session-token',
    })
  }

  if (!token) {
    token = await getToken({
      req,
      secret,
      secureCookie: true,
      salt: '__Secure-next-auth.session-token',
    })
  }

  const hasError = req.nextUrl.searchParams.has('error')

  if (isAdminLogin || isAdminSignup) {
    if (token && !hasError) {
      if (isAdminRole(token.role as string)) {
        return NextResponse.redirect(new URL('/admin', req.nextUrl.origin))
      }
      return NextResponse.redirect(new URL('/user/dispatch', req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  const isProtectedRoute =
    pathname.startsWith('/user') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/report')

  if (!isProtectedRoute) {
    if (pathname === '/login' && token && !hasError) {
      if (isAdminRole(token.role as string)) {
        return NextResponse.redirect(new URL('/admin', req.nextUrl.origin))
      }
      return NextResponse.redirect(new URL('/user/dispatch', req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  if (!token) {
    const loginUrl = new URL(pathname.startsWith('/admin') ? '/admin/login' : '/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && !isAdminRole(token.role as string)) {
    const loginUrl = new URL('/admin/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/user') && isAdminRole(token.role as string)) {
    const adminUrl = new URL('/admin', req.nextUrl.origin)
    return NextResponse.redirect(adminUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*', '/report/:path*', '/login'],
}