import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';

import { api } from './api';
import type { Note, NoteTag } from '../../types/note';
import type { User } from '../../types/user';

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

const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();

  return cookieStore.toString();
};

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: FetchNotesParams = { page, perPage };

  if (search?.trim()) {
    params.search = search.trim();
  }

  if (tag) {
    params.tag = tag;
  }

  const response = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me', {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const checkSession = async (): Promise<AxiosResponse<User | null>> => {
  const response = await api.get<User | null>('/auth/session', {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response;
};