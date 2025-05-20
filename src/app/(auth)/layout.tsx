import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div>{children}</div>
      <Toaster />
    </main>
  );
}
