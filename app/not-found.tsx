import type { Metadata } from 'next';
import css from './not-found.module.css';

export const metadata: Metadata = {
  title: '404 Page',
  description: 'Page does not exist',
  openGraph: {
    title: '404 Page',
    description: 'Page does not exist',
    url: '/not-found',
    images: [
      'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
    ],
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>

      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}