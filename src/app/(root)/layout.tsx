import Navbar from '@/components/layout/Navbar';
import Search from '@/components/layout/Search';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar></Navbar>
      <Search />
      <div>{children}</div>
    </main>
  );
}
