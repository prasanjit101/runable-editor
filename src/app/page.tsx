import { HydrateClient } from '@/trpc/server';

export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-screen flex flex-col">
        <p>Hello world</p>
      </div>
    </HydrateClient>
  );
}
