import Link from 'next/link';
import styles from './not-found.module.css';
import { GoArrowUpRight } from 'react-icons/go';

export default function NotFound() {
  return (
    <section className={styles.page}>
      <div className={styles.bgNumber} aria-hidden="true">
        <span>4</span>
        <span>0</span>
        <span>4</span>
      </div>

      <div className={styles.scanlines} aria-hidden="true" />

      <div className={styles.content}>
        <span className={styles.label}>Error — 404</span>

        <h1 className={styles.title}>
          Page not
          <br />
          <em>found.</em>
        </h1>

        <p className={styles.sub}>
          The page you&apos;re looking for
          <br />
          doesn&apos;t exist or was moved.
        </p>

        <Link href="/" className={styles.btn}>
          Back to home <GoArrowUpRight className={styles.iconArrow} />
        </Link>
      </div>

      {/* Vertical index */}
      <span className={styles.vertLabel} aria-hidden="true">
        404 — Not Found
      </span>
    </section>
  );
}

// // ==========================================================================================
// // not-found.tsx - це спеціальний файл у Next.js, який використовується для відображення
// // сторінки 404, коли користувач намагається отримати доступ до неіснуючої сторінки.
// // ==========================================================================================

// // Імпорт Метаданих
// import { Metadata } from 'next';

// // Визначення метаданих та openGraph для сторінки 404
// export const metadata: Metadata = {
//   title: '404 - Page not found',
//   description: 'The page you are looking for does not exist.',
//   openGraph: {
//     title: `404 - Page not found`,
//     description: 'The page you are looking for does not exist.',
//     siteName: 'NoteHub',
//     images: [
//       {
//         url: 'notehub-og-meta.jpg',
//         width: 1200,
//         height: 630,
//         alt: `NoteHub picture`,
//       },
//     ],
//     type: 'website',
//   },
// };

// // Імпорт стилів для сторінки 404
// import css from './MainPage.module.css';

// // Компонент NotFound, який відображає повідомлення про помилку 404
// const NotFound = () => {
//   return (
//     <div className={css.container}>
//       <h1 className={css.title}>404 - Page not found</h1>
//       <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
//     </div>
//   );
// };

// export default NotFound;
