// ======================================================================================
// Роут виходу користувача з системи (logout) в API.
// ======================================================================================
// запит до API
// хендлер запиту
// очищення глобального стану
// редірект на сторінку авторизації
// ======================================================================================
import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST() {
  try {
    // Передаємо поточні cookie до API
    const cookieStore = await cookies();

    // const accessToken = cookieStore.get('accessToken')?.value;
    // const refreshToken = cookieStore.get('refreshToken')?.value;
    // const sessionId = cookieStore.get('sessionId')?.value;

    // await api.post('/api/auth/logout', null, {
    //   headers: {
    //     Cookie: `sessionId=${sessionId}; accessToken=${accessToken}; refreshToken=${refreshToken}`,
    //   },
    // });

    await api.post('api/auth/logout', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    // Очищаємо токени після запиту
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('sessionId');

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
