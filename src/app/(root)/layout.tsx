import Navbar from '@/components/layout/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar></Navbar>
      <div>{children}</div>
    </main>
  );
}
