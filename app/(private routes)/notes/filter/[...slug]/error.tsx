'use client';

export default function NotesFilterError({ error }: { error: Error }) {
  return <p>Could not fetch the list of notes. {error.message}</p>;
}