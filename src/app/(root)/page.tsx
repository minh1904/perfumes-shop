import Discover from '@/components/ui/landingpage/Discover';
import Hero from '@/components/ui/landingpage/Hero';
import Pledge from '@/components/ui/landingpage/Pledge';

export default function Home() {
  return (
    <div>
      <Hero />
      <Pledge />
      <Discover />
    </div>
  );
}
