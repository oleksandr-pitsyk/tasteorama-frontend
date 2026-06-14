// ==========================================================================================
// not-found.tsx - це спеціальний файл у Next.js, який використовується для відображення
// сторінки 404, коли користувач намагається отримати доступ до неіснуючої сторінки.
// ==========================================================================================

// Імпорт Метаданих
import { Metadata } from 'next';

// Визначення метаданих та openGraph для сторінки 404
export const metadata: Metadata = {
  title: '404 - Page not found',
  description: 'The page you are looking for does not exist.',
  openGraph: {
    title: `404 - Page not found`,
    description: 'The page you are looking for does not exist.',
    siteName: 'NoteHub',
    images: [
      {
        url: 'notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: `NoteHub picture`,
      },
    ],
    type: 'website',
  },
};

// Імпорт стилів для сторінки 404
import css from './MainPage.module.css';

// Компонент NotFound, який відображає повідомлення про помилку 404
const NotFound = () => {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
