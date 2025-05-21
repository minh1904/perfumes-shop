'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

type Res = { success: true } | { success: false; error: string; statusCode: 401 | 500 };

export async function loginUserAction(data: unknown): Promise<Res> {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('email' in data) ||
    !('password' in data) ||
    typeof data.email !== 'string' ||
    typeof data.password !== 'string'
  ) {
    throw new Error('Invalid JSON Object');
  }
  try {
    await signIn('credentials', {
      ...data,
      redirect: false,
    });
    return { success: true };
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case 'CredentialsSignin':
        case 'CallbackRouteError':
          return { success: false, error: 'Invalid credentials', statusCode: 401 };
        default:
          return { success: false, error: 'Oops, something went wrong', statusCode: 500 };
      }
    }
    return { success: false, error: 'Internal Server Error', statusCode: 500 };
  }
}
