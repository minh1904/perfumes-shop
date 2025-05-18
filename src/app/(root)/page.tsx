import Cart from '@/components/layout/Cart';
import Footer from '@/components/layout/Footer';
import Menu from '@/components/layout/Menu';
import { Overlay } from '@/components/layout/Overlay';
import Hero from '@/components/landingpage/Hero';
import Journal from '@/components/landingpage/Journal';
import Pledge from '@/components/landingpage/Pledge';
import Story from '@/components/landingpage/Story';
import Discovers from '@/components/landingpage/Discovers';

export default function Home() {
  return (
    <div>
      <Hero />
      <Pledge />
      <Discovers />
      <Story />
      <Journal />
      <Footer />
      <Cart />
      <Overlay />
      <Menu />
    </div>
  );
}
