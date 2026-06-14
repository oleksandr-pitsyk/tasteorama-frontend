// Імпорт глобальних стилів
import './globals.css';

// Імпорт компонента TanStackProvider
// Підключення провайдера React Query,
// щоб усі клієнтські компоненти могли використовувати useQuery, кеш і мутації.
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

// Імпорт компонента Header
import Header from '@/components/Header/Header';
// Імпорт компонента Footer
import Footer from '@/components/Footer/Footer';

// Імпорт шрифтів з Google Fonts за допомогою Next.js
import { Roboto } from 'next/font/google';

// Налаштування шрифтів та їхніх властивостей, таких як вага, підмножини та змінні CSS для використання в стилях.
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  // браузер одразу показує текст, навіть якщо шрифт ще не завантажився, замінюючи його на системний шрифт, а потім замінює його на Roboto, коли він завантажується, що покращує користувацький досвід і зменшує час відображення тексту.
  display: 'swap',
});

// Визначення метаданих для всього сайту, включаючи заголовок, опис та налаштування Open Graph для соціальних мереж.
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'NoteHub',
  description: 'NoteHub - Your Personal Note-Taking App - Powered by Next.js and React Query',
  openGraph: {
    title: `NoteHub`,
    description: 'NoteHub - Your Personal Note',
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

// Додаємо провайдер авторизації у layout.tsx,
// щоб дані про авторизацію були доступні в будь-якому компоненті застосунку:
import AuthProvider from '@/components/AuthProvider/AuthProvider';

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {/* <main> */}
            {children}
            {modal}
            {/* </main> */}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
