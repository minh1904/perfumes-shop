'use server';

import { signIn } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function oauthLoginAction(provider: 'google') {
  try {
    await signIn(provider, { redirectTo: '/' });
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }
  }
}
