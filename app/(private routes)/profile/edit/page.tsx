'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import css from './EditProfilePage.module.css';
import { getMe, updateMe } from '@/lib/api/clientApi';
import type { User } from '@/types/user';
import { useAuthStore } from '@/lib/store/authStore';

export default function EditProfilePage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [userData, setUserData] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setUserData(user);
        setUsername(user.username);
      } catch {
        setError('Failed to load user');
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push('/profile');
    } catch {
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={userData.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <p>Email: {userData.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {error && <p>{error}</p>}
        </form>
      </div>
    </main>
  );
}