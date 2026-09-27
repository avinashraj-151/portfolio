import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { upsertUser, getUserByEmail } from "@/lib/supabase"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) return true

      try {
        const userId = account?.providerAccountId || profile?.sub || user.id
        const username = user.name || profile?.name || user.email.split("@")[0]
        const image = user.image || profile?.picture || ""

        await upsertUser({
          id: userId,
          email: user.email,
          username,
          image,
          role: "user",
        })
      } catch (err) {
        console.error("Error in NextAuth signIn callback syncing to Supabase:", err)
      }
      return true
    },
    async jwt({ token, user, account, profile }) {
      if (user?.email) {
        token.email = user.email
      }
      if (user?.id) {
        token.id = user.id
      }

      // Fetch user from Supabase by email to retrieve persistent ID & role (e.g. 'admin')
      if (token?.email) {
        try {
          const dbUser = await getUserByEmail(token.email)
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role || "user"
          }
        } catch {
          // Fallback to existing token values
        }
      }

      if (!token.role) {
        token.role = "user"
      }

      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id || token.sub
        session.user.role = token.role || "user"
      }
      return session
    },
  },
})
