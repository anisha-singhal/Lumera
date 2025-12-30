import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

// Development fallback secret - in production, always use NEXTAUTH_SECRET env variable
const authSecret = process.env.NEXTAUTH_SECRET || 'lumera-dev-secret-key-change-in-production'

const handler = NextAuth({
  providers: [
    // Only add Google provider if credentials are configured
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
      },
      async authorize(credentials) {
        // In production, verify against your database
        // For now, accept any email/password with minimum validation
        if (credentials?.email && credentials?.password && credentials.password.length >= 6) {
          // Generate a consistent ID based on email
          const id = Buffer.from(credentials.email.toLowerCase()).toString('base64')
          return {
            id,
            name: credentials.email.split('@')[0],
            email: credentials.email,
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/', // We use a custom modal, so redirect to home
  },
  callbacks: {
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
  secret: authSecret,
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }