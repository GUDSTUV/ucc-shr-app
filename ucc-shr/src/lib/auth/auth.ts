import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/src/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        portal: { label: "Portal", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const portal = String(credentials.portal ?? '').toLowerCase()

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!user) {
          return null
        }

        // Google-only accounts have no password
        if (!user.password) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordMatch) {
          return null
        }

        // Block unverified email users
        if (!user.emailVerified) {
          return null
        }

        // Enforce separated auth entry points for admin and user apps.
        if (portal === 'admin' && user.role !== 'SUPER_ADMIN') {
          return null
        }

        if (portal === 'user' && user.role === 'SUPER_ADMIN') {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false
        const email = user.email.toLowerCase()

        const existing = await prisma.user.findUnique({
          where: { email },
          select: { id: true, role: true },
        })

        // Block SUPER_ADMIN from signing in via Google on the user portal
        if (existing?.role === 'SUPER_ADMIN') return '/login?error=AccessDenied'

        if (!existing) {
          await prisma.user.create({
            data: {
              email,
              name: user.name ?? email.split('@')[0],
              image: user.image ?? null,
              role: 'STAFF',
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      // Google sign-in: look up the DB user to get our id and role
      if (account?.provider === 'google' && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, image: true },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.picture = dbUser.image ?? token.picture
        }
      } else if (user) {
        // Credentials sign-in
        token.id = user.id
        token.role = user.role
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.image = token.picture as string | null | undefined
        
        if (session.user.email) {
          const prefix = session.user.email.split('@')[0]
          const nameFromEmail = prefix.replace(/[._]/g, ' ')
          session.user.name = nameFromEmail.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        }
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  }
})
