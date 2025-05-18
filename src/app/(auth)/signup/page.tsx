import SignupForm from '@/components/form/signup-form';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747561220/miska-sage-GnF5Xpu-764-unsplash_ekecqp.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={500}
          height={500}
        />
      </div>
      <div className="relative col-span-2 flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start"></div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm md:max-w-xl">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
