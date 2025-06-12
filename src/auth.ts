import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import * as argon2 from 'argon2';
import { loginSchema } from '@/lib/schemas/auth';
import { findUserByEmail } from '@/resources/user-queries';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import * as schema from '@/db/schema';
import { db } from './db/db';
import { oauthVerifyEmailAction } from './actions/oauth-verify-email-action';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    accountsTable: schema.accounts,
    usersTable: schema.users,
    authenticatorsTable: schema.authenticators,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (user?.role) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        return !!profile?.email_verified;
      }
      if (account?.provider === 'credentials') {
        if (user.emailVerified) {
        }
        return true;
      }
      return false;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      if (['google'].includes(account.provider)) {
        if (user.email) await oauthVerifyEmailAction(user.email);
      }
    },
  },

  providers: [
    Google({
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await findUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordMatch = await argon2.verify(user.password, password);
          if (passwordMatch) {
            const { password: _, ...userWithoutPassWord } = user;
            console.log(_);
            return userWithoutPassWord;
          }
        }
        return null;
      },
    }),
  ],
});
