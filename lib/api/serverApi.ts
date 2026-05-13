import axios from 'axios';
import { cookies } from 'next/headers';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

const getServerApi = async () => {
  const cookieStore = await cookies();

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
};

export const fetchNotes = async ({
  search = '',
  page = 1,
  tag,
}: FetchNotesParams): Promise<NotesResponse> => {
  const serverApi = await getServerApi();

  const { data } = await serverApi.get<NotesResponse>('/notes', {
    params: {
      search,
      page,
      perPage: 12,
      tag,
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const serverApi = await getServerApi();
  const { data } = await serverApi.get<Note>(`/notes/${id}`);
  return data;
};

export const getMe = async (): Promise<User> => {
  const serverApi = await getServerApi();
  const { data } = await serverApi.get<User>('/users/me');
  return data;
};

export const checkSession = async (): Promise<User | null> => {
  const serverApi = await getServerApi();
  const { data } = await serverApi.get<User | null>('/auth/session');
  return data;
};