import Cart from '@/components/layout/Cart';
import Footer from '@/components/layout/Footer';
import { Overlay } from '@/components/layout/Overlay';
import Discover from '@/components/ui/landingpage/Discover';
import Hero from '@/components/ui/landingpage/Hero';
import Journal from '@/components/ui/landingpage/Journal';
import Pledge from '@/components/ui/landingpage/Pledge';
import Story from '@/components/ui/landingpage/Story';

export default function Home() {
  return (
    <div>
      <Hero />
      <Pledge />
      <Discover />
      <Story />
      <Journal />
      <Footer />
      <Cart />
      <Overlay />
    </div>
  );
}
