import { HydrateClient } from '@/trpc/server';
import Header from '@/components/block/Header';
import { Hero } from '@/components/landing/hero';
import Footer from '@/components/block/Footer';
import { Separator } from '@/components/ui/separator';

export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Hero />
        <Separator />
        <Footer />
      </div>
    </HydrateClient>
  );
}
