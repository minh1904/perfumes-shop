<<<<<<< HEAD
import 'server-only';
=======
'use server';
>>>>>>> 474a2e41a1cbbf5ffeb1e897eaf0c1525fda30bf
import { lower, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/db/db';

export const findUserByEmail = async (email: string): Promise<typeof users.$inferSelect | null> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()))
    .then((res) => res[0] ?? null);

  return user;
};
