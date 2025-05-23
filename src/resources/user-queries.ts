import 'server-only';
import { lower, users } from '@/db/schema';
import { eq, getTableColumns } from 'drizzle-orm';
import { db } from '@/db/db';
import { auth } from '@/auth';

export const findUserByEmail = async (email: string): Promise<typeof users.$inferSelect | null> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()))
    .then((res) => res[0] ?? null);
  return user;
};

export const findUserByID = async () => {
  const session = await auth();
  const sessionUserId = session?.user?.id;

  if (!sessionUserId) throw new Error('unauthorize');

  const { password, ...rest } = getTableColumns(users);
  console.log(password);

  const user = await db
    .select(rest)
    .from(users)
    .where(eq(lower(users.id), sessionUserId))
    .then((res) => res[0] ?? null);

  if (!user) throw new Error('User not found');

  return user;
};
