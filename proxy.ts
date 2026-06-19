// =====================================================================================
// proxy - це спеціальна функція, яка виконується до того, як сторінка буде показана користувачеві.
// Вона спрацьовує навіть раніше, ніж SSR (server-side rendering).
// =====================================================================================
// Коли користувач переходить на певну сторінку:
//      Браузер надсилає запит до сервера Next.js.
//      Next.js запускає proxy і передає функції об'єкт request.
//      request містить всю важливу інформацію: шлях, cookie, заголовки тощо.
//      Ми можемо перевірити наявність токенів і вирішити – дозволити доступ чи перенаправити користувача.
// ====================================================================================
// proxy – функція, яка виконується перед рендерингом і може захистити сторінки.
// request – об'єкт із даними запиту.
// accessToken/refreshToken – токени в cookie, що підтверджують авторизацію.
// publicRoutes – маршрути, доступні лише для неавторизованих користувачів.
// privateRoutes – маршрути, доступні лише для авторизованих.
// matcher – перелік маршрутів, для яких proxy має спрацьовувати.
// =====================================================================================

// Експортуємо саму функцію proxy та клас NextResponse
// клас NextResponse. За його допомогою будемо робити редірект або дозволяти доступ до маршруту.
import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSessionServer } from './lib/api/serverApi';

// масив приватних маршрутів
const privateRoutes = [
  '/logout',
  '/profile/own',
  '/profile/favorites',
  '/add-recipe',
  '/recipes/:path*',
];
// масив публічних маршрутів
const publicRoutes = ['/auth/login', '/auth/register', '/recipes'];

export async function proxy(request: NextRequest) {
  // Отримання токенів із cookie
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Шлях, на який користувач намагається перейти
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  if (!accessToken) {
    if (refreshToken) {
      // Якщо accessToken відсутній, але є refreshToken — потрібно перевірити сесію навіть для публічного маршруту,
      // адже сесія може залишатися активною, і тоді потрібно заборонити доступ до публічного маршруту.
      const data = await checkSessionServer();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: Number(parsed['Max-Age']),
          };
          if (parsed.accessToken) cookieStore.set('accessToken', parsed.accessToken, options);
          if (parsed.refreshToken) cookieStore.set('refreshToken', parsed.refreshToken, options);
          if (parsed.sessionId) cookieStore.set('sessionId', parsed.sessionId, options);
        }
        // Якщо сесія все ще активна:
        // для публічного маршруту — виконуємо редірект на головну.
        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
        // для приватного маршруту — дозволяємо доступ
        if (isPrivateRoute) {
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      }
    }
    // Якщо refreshToken або сесії немає:
    // публічний маршрут — дозволяємо доступ
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // приватний маршрут — редірект на сторінку входу
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Якщо accessToken існує:
  // публічний маршрут — виконуємо редірект на головну
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  // приватний маршрут — дозволяємо доступ
  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

// об'єкт config, у якому вказуємо маршрути, до яких застосовується proxy.
// У config вказуємо, для яких маршрутів має запускатися proxy.
// Для цього служить властивість matcher
export const config = {
  matcher: [
    '/auth/login',
    '/auth/register',
    '/logout',
    '/profile/own',
    '/profile/favorites',
    '/add-recipe',
    '/recipes',
    '/recipes/:path*',
  ],
};
