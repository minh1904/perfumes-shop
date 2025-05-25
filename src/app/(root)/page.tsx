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
    </div>
  );
}
