// ======================================================================================
// layout.tsx – це кореневий компонент, який обгортає всі сторінки та компоненти Next.js.
// ======================================================================================
// Нормалізація стилів
import 'modern-normalize';

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
import { Montserrat, DM_Sans } from 'next/font/google';
// Налаштування шрифтів та їхніх властивостей, таких як вага, підмножини та змінні CSS для використання в стилях.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat', // Створюємо CSS-змінну для цього шрифту
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'], // сабсети для кирилиці - ['cyrillic'])
  weight: ['700'],
  variable: '--font-dm-sans', // Створюємо CSS-змінну для цього шрифту
  display: 'swap',
});

// Визначення метаданих для всього сайту, включаючи заголовок, опис та налаштування Open Graph для соціальних мереж.
import type { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: '/favicon-without-fill.svg',
  },
  metadataBase: new URL('https://tasteorama-frontend.vercel.app/'),
  title: 'Tasteorama',
  description: 'Tasteorama - Your Ultimate Recipe Companion',
  openGraph: {
    title: `Tasteorama`,
    description: 'Tasteorama - Your Ultimate Recipe Companion',
    siteName: 'Tasteorama - Your Ultimate Recipe Companion',
    images: [
      {
        url: 'favicon.svg',
        width: 1200,
        height: 630,
        alt: `Tasteorama picture`,
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
      <body className={`${montserrat.variable} ${dmSans.variable}`}>
        <TanStackProvider>
          {/* Провайдер авторизації */}
          <AuthProvider>
            <Header />
            <main>
              {children}
              {modal}
            </main>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}

// c modal
// export default function RootLayout({
//   children,
//   modal,
// }: Readonly<{
//   children: React.ReactNode;
//   modal: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={roboto.variable}>
//         <TanStackProvider>
//           {/* Провайдер авторизації */}
//           <AuthProvider>
//             <Header />
//             {/* <main> */}
//             {children}
//             {modal}
//             {/* </main> */}
//             <Footer />
//           </AuthProvider>
//         </TanStackProvider>
//       </body>
//     </html>
//   );
// }
