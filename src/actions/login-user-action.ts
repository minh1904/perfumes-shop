'use server';

import { signIn } from '@/auth';

type Res = { success: true; data?: unknown } | { success: false; error: string; statusCode: 500 };

export async function loginUserAction(data: unknown): Promise<Res> {
  console.log(data);

  try {
    if (typeof data !== 'object' || data == null || Object.entries(data)) {
      throw new Error('err');
    }

    await signIn('credentials', { ...data, redirect: false });
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, error: 'Internal Server Error', statusCode: 500 };
  }
  return { success: true };
}
