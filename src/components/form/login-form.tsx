'use client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { loginSchema, TloginSchema } from '@/lib/schemas/auth';
import { loginUserAction } from '@/actions/login-user-action';
import { toast } from 'sonner';
import { oauthLoginAction } from '@/actions/oauth-login-action';
export default function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TloginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const clickHandle = async (provider: 'google') => {
    await oauthLoginAction(provider);
  };

  const router = useRouter();

  const onSubmit = async (data: TloginSchema) => {
    const res = await loginUserAction(data);

    if (res.success) {
      toast.success('Thanks for login');
      router.push('/');
    } else {
      switch (res.statusCode) {
        case 401:
          setError('password', { message: res.error });
          break;
        case 500:
        default:
          const error = res.error || 'Internal Server Error';
          setError('password', { message: error });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="absolute top-0 left-0 flex w-full items-center justify-between px-15 py-2">
        <Image
          src="/logo.png"
          alt="Logo ParfumÉlite"
          width={600}
          height={600}
          sizes="100vw"
          className="h-15 w-auto object-contain"
        />
        <Link href="/" className="font-normal underline">
          Return to store
        </Link>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-7xl font-semibold">Login </h1>
        <p className="text-muted-foreground text-sm font-normal text-balance">
          By accessing your ParfumÉlite account you can track and manage your orders and also save
          multiple addresses.
        </p>
      </div>
      <div className="mt-10 grid gap-2">
        <div className="relative grid">
          <Input {...register('email')} id="email" type="email" placeholder="ENTER YOUR EMAIL" />
          {errors.email && (
            <p className="absolute -bottom-6 left-2 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="relative mt-5 grid">
          <Input {...register('password')} id="password" type="password" placeholder="PASSWORD" />
          {errors.password && (
            <p className="absolute -bottom-6 left-2 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <p className="mt-7 cursor-pointer text-center underline">Forgot Password</p>
        <div className="grid w-full gap-3 md:grid-cols-2">
          <Button
            type="button"
            onClick={clickHandle.bind(null, 'google')}
            variant="outline"
            className="border-blacky hidden cursor-pointer rounded-full py-7 uppercase md:flex"
          >
            Login with google
            <svg
              width="256"
              height="262"
              viewBox="0 0 256 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded-full py-7"
          >
            LOGIN
          </Button>
          <Button
            type="button"
            onClick={clickHandle.bind(null, 'google')}
            variant="outline"
            className="border-blacky cursor-pointer rounded-full py-7 uppercase md:hidden"
          >
            Login with google{' '}
            <svg
              width="256"
              height="262"
              viewBox="0 0 256 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
          </Button>
        </div>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
