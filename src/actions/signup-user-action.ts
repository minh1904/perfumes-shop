'use server';
import { db } from '@/db/db';
import { lower, users } from '@/db/schema';
import { signupSchema } from '@/lib/schemas/auth';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';

type FieldErrors = {
  name?: string[] | undefined;
  email?: string[] | undefined;
  password?: string[] | undefined;
};

type Res =
  | { success: true; data?: unknown }
  | { success: false; error: FieldErrors; statusCode: 400 }
  | { success: false; error: string; statusCode: 409 | 500 };

export async function signupUserAction(data: unknown): Promise<Res> {
  const parsedValues = signupSchema.safeParse(data);

  if (!parsedValues.success) {
    const flatErrors = parsedValues.error.flatten();
    return { success: false, error: flatErrors.fieldErrors, statusCode: 400 };
  }
  const { name, email, password } = parsedValues.data;

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(lower(users.email), email.toLowerCase()))
      .then((res) => res[0] ?? null);
    if (existingUser?.id) {
      return { success: false, error: 'Email already exists', statusCode: 409 };
    }
  } catch (err) {
    console.log(err);
    return { success: false, error: 'Internal Server error', statusCode: 500 };
  }

  try {
    //Hash password
    const hashedPassword = await argon2.hash(password);
    console.log({ name, email, password: hashedPassword });

    //Save user to db
    const newUser = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning({ id: users.id })
      .then((res) => res[0]);
    console.log(newUser);

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Internal Server Error', statusCode: 500 };
  }
}
