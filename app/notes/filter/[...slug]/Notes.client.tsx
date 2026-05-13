'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes } from '../../../../lib/api';
import type { NoteTag } from '../../../../types/note';

import NoteList from '../../../../components/NoteList/NoteList';
import Pagination from '../../../../components/Pagination/Pagination';
import SearchBox from '../../../../components/SearchBox/SearchBox';

import css from './page.module.css';

interface NotesClientProps {
  initialTag?: NoteTag;
}

const PER_PAGE = 12;

export default function NotesClient({
  initialTag,
}: NotesClientProps) {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');

  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    500
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', page, search, initialTag ?? 'all'],

    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag: initialTag,
      }),

    placeholderData: (previousData) => previousData,
  });

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error) {
    return <p>Could not fetch the list of notes.</p>;
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onChange={handleSearchChange}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <Link
          href="/notes/action/create"
          className={css.button}
        >
          Create note +
        </Link>
      </header>

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {data && data.notes.length === 0 && (
        <p>No notes found.</p>
      )}
    </div>
  );
}