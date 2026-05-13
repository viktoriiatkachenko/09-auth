import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  search?: string;
  perPage: number;
  page?: number;
  tag?: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface UpdateUserData {
  username: string;
}

export const fetchNotes = async ({
  search = '',
  page = 1,
  tag,
}: FetchNotesParams): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>('/notes', {
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
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (
  note: Pick<Note, 'title' | 'content' | 'tag'>,
): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const register = async (credentials: AuthCredentials): Promise<User> => {
  const { data } = await api.post<User>('/auth/register', credentials);
  return data;
};

export const login = async (credentials: AuthCredentials): Promise<User> => {
  const { data } = await api.post<User>('/auth/login', credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | null>('/auth/session');
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateMe = async (user: UpdateUserData): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', user);
  return data;
};