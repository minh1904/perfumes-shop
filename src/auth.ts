import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import * as argon2 from 'argon2';
import { loginSchema } from '@/lib/schemas/auth';
import { findUserByEmail } from '@/resources/user-queries';
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: '/login' },
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
