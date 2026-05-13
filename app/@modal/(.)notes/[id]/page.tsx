import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api';
import { makeQueryClient } from '../../../../lib/queryClient';
import NotePreview from './NotePreview.client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview />
    </HydrationBoundary>
  );
}