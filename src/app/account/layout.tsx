import Cart from '@/components/layout/Cart';
import Footer from '@/components/layout/Footer';
import Menu from '@/components/layout/Menu';
import Navbar from '@/components/layout/Navbar';
import { Overlay } from '@/components/layout/Overlay';
import Search from '@/components/layout/Search';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative">
      <Navbar />
      <Search />
      <Cart />
      <Overlay />
      <Menu />
      <div>{children}</div>
      <Footer />
    </main>
  );
}
