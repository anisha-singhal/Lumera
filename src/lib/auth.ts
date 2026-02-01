import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendMail } from '@/lib/sendMail'
import { randomUUID } from 'crypto'

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        isSignup: { label: 'isSignup', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const payload = await getPayload({ config })
          const { password, name, isSignup } = credentials
          const email = credentials.email.trim().toLowerCase()

          if (isSignup === 'true') {
            const user = await payload.create({
              collection: 'users',
              data: {
                email,
                password,
                name: name || email.split('@')[0],
                role: 'customer',
              },
            })

            try {
              await sendMail({
                to: user.email,
                subject: 'Welcome to Lumera Candles!',
                message: `Hi ${user.name || 'there'},\n\nWelcome to Lumera Candles! We are excited to have you on board.\n\nExplore our collection of premium candles at proper pricing.\n\nBest regards,\nThe Lumera Team`,
              })
            } catch (mailError) {
              console.error('Failed to send welcome email:', mailError)
            }

            return {
              id: user.id.toString(),
              name: (user.name as string) || '',
              email: user.email,
            }
          } else {
            const result = await payload.login({
              collection: 'users',
              data: {
                email,
                password,
              },
            })

            if (result.user) {
              return {
                id: result.user.id.toString(),
                name: (result.user.name as string) || '',
                email: result.user.email,
              }
            }
          }
          return null
        } catch (error: any) {
          console.error('Auth error full object:', JSON.stringify(error, null, 2))
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth sign-in - create or find user in Payload
      if (account?.provider === 'google' && user.email) {
        try {
          const payload = await getPayload({ config })

          // Check if user already exists
          const existingUsers = await payload.find({
            collection: 'users',
            where: { email: { equals: user.email } },
            limit: 1,
          })

          if (existingUsers.docs.length === 0) {
            // Create new user for Google sign-in
            const newUser = await payload.create({
              collection: 'users',
              data: {
                email: user.email,
                name: user.name || user.email.split('@')[0],
                role: 'customer',
                password: crypto.randomUUID(), // Random password for OAuth users
              },
            })
            user.id = newUser.id.toString()
          } else {
            user.id = existingUsers.docs[0].id.toString()
          }
        } catch (error) {
          console.error('Error handling Google sign-in:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'lumera-dev-secret-key-change-in-production',
  debug: process.env.NODE_ENV === 'development',
}
