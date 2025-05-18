import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { db } from './db/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
});
