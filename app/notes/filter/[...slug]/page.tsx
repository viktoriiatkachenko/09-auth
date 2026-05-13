import type { Metadata } from 'next';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '../../../../lib/api';
import { makeQueryClient } from '../../../../lib/queryClient';
import type { NoteTag } from '../../../../types/note';
import NotesClient from './Notes.client';

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const allowedTags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const getTag = (slug: string[]): NoteTag | undefined => {
  const selectedTag = slug[0];

  if (selectedTag === 'all') {
    return undefined;
  }

  if (allowedTags.includes(selectedTag as NoteTag)) {
    return selectedTag as NoteTag;
  }

  return undefined;
};

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTag(slug);
  const filterName = tag ?? 'All notes';

  return {
    title: `NoteHub - ${filterName}`,
    description: `Browse notes filtered by ${filterName}.`,
    openGraph: {
      title: `NoteHub - ${filterName}`,
      description: `Browse notes filtered by ${filterName}.`,
      url: `/notes/filter/${slug.join('/')}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = getTag(slug);

  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}