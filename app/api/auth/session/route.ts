// ======================================================================================
// Роут перевірки сесії користувача
// ======================================================================================
// виклик checkSession перевіряє наявність accessToken і повертає інформацію про валідність сесії,
// або автоматично оновлює токени за допомогою refreshToken, або повідомляє, що сесія невалідна.
// ======================================================================================
// не просто GET-запит – нам потрібно реалізувати наступну логіку хендлера:
// отримати поточні cookie
// дістати значення кожного токена (accessToken, refreshToken)
// якщо accessToken існує, то користувач авторизований –
// без запитів до API одразу повертаємо відповідь { success: true }
// якщо accessToken не існує (він «протух» і автоматично зник), перевіряємо наявність refreshToken
// якщо refreshToken не існує – повертаємо відповідь { success: false }
// якщо refreshToken існує – виконуємо запит до API для перевірки його валідності.
// Якщо він дійсний, бекенд поверне нову пару свіжих токенів,
// і їх треба засетити так само як при логіні чи реєстрації, та повернути відповідь { success: true }
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// import { api } from '../../api';
// import { parse } from 'cookie';

export async function GET() {
  // Отримуємо інстанс для роботи з cookie
  const cookieStore = await cookies();

  // Дістаємо токени
  const accessToken = cookieStore.get('accessToken')?.value;
  // const refreshToken = cookieStore.get('refreshToken')?.value;

  // Якщо accessToken є — сесія валідна
  if (accessToken) {
    return NextResponse.json({ success: true });
  }

  // Якщо accessToken немає — перевіряємо refreshToken
  // if (refreshToken) {
  //   // Виконуємо запит до API, передаючи всі cookie у заголовку
  //   const apiRes = await api.get('/api/auth/session', {
  //     headers: {
  //       Cookie: cookieStore.toString(), // перетворюємо cookie у рядок
  //     },
  //   });

  //   // Якщо бекенд повернув нові токени — встановлюємо їх
  //   const setCookie = apiRes.headers['set-cookie'];
  //   if (setCookie) {
  //     const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
  //     for (const cookieStr of cookieArray) {
  //       const parsed = parse(cookieStr);
  //       const options = {
  //         expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
  //         path: parsed.Path,
  //         maxAge: Number(parsed['Max-Age']),
  //       };
  //       if (parsed.accessToken) cookieStore.set('accessToken', parsed.accessToken, options);
  //       if (parsed.refreshToken) cookieStore.set('refreshToken', parsed.refreshToken, options);
  //     }
  //     return NextResponse.json({ success: true });
  //   }
  // }

  // Якщо немає refreshToken або API повернув пустий setCookie — сесія невалідна
  return NextResponse.json({ success: false });
}
