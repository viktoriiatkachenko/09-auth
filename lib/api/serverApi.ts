import axios, { type AxiosResponse } from 'axios';
import { cookies } from 'next/headers';

import type { Note, NoteTag } from '../../types/note';
import type { User } from '../../types/user';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const createServerApi = async () => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore.toString();

  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
  });
};

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const api = await createServerApi();

  const params: FetchNotesParams = {
    page,
    perPage,
  };

  if (search?.trim()) {
    params.search = search.trim();
  }

  if (tag) {
    params.tag = tag;
  }

  const response = await api.get<FetchNotesResponse>(
    '/notes',
    {
      params,
    }
  );

  return response.data;
};

export const fetchNoteById = async (
  id: string
): Promise<Note> => {
  const api = await createServerApi();

  const response = await api.get<Note>(
    `/notes/${id}`
  );

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const api = await createServerApi();

  const response = await api.get<User>(
    '/users/me'
  );

  return response.data;
};

export const checkSession = async (): Promise<
  AxiosResponse<User | null>
> => {
  const api = await createServerApi();

  const response = await api.get<User | null>(
    '/auth/session'
  );

  return response;
};