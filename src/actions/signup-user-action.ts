'use server';
import { signupSchema } from '@/lib/schemas/auth';
import * as argon2 from 'argon2';
type FieldErrors = {
  name?: string[] | undefined;
  email?: string[] | undefined;
  password?: string[] | undefined;
};

type Res =
  | { success: true; data?: unknown }
  | { success: false; error: FieldErrors; statusCode: 400 }
  | { success: false; error: string; statusCode: 500 };

export async function signupUserAction(data: unknown): Promise<Res> {
  const parsedValues = signupSchema.safeParse(data);

  if (!parsedValues.success) {
    const flatErrors = parsedValues.error.flatten();
    return { success: false, error: flatErrors.fieldErrors, statusCode: 400 };
  }
  const { name, email, password } = parsedValues.data;

  try {
    //Hash password
    const hashedPassword = await argon2.hash(password);
    console.log({ name, email, password: hashedPassword });

    //Save user to db

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Internal Server Error', statusCode: 500 };
  }
}
