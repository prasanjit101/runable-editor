import { HydrateClient } from '@/trpc/server';
import { MainEditor } from '@/components/editor/main-editor';

export default async function Home() {
  return (
    <HydrateClient>
      <MainEditor />
    </HydrateClient>
  );
}
