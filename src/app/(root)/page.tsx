import Discover from '@/components/ui/landingpage/Discover';
import Hero from '@/components/ui/landingpage/Hero';
import Pledge from '@/components/ui/landingpage/Pledge';
import Story from '@/components/ui/landingpage/Story';

export default function Home() {
  return (
    <div>
      <Hero />
      <Pledge />
      <Discover />
      <Story />
    </div>
  );
}
