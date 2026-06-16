// ======================================================================================
// Роут перевірки сесії користувача
// ======================================================================================
// auth/me – це приватний маршрут в API, тому, так само як і auth/session,
// обов’язково має отримувати cookie
// ======================================================================================

// Роут перевірки сесії користувача
// ======================================================================================
// auth/me – це приватний маршрут в API, тому, так само як і auth/session,
// обов’язково має отримувати cookie
// ======================================================================================
import { NextResponse } from 'next/server';
import { api, ApiError } from '../../api';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    console.log('cookieStore', cookieStore);

    const apiRes = await api.get('/api/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    console.log('apiRes', apiRes);

    return NextResponse.json(apiRes.data);
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as ApiError).response?.data?.error ?? (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }
}

// import { NextResponse } from 'next/server';
// import { api } from '../../api';
// import { cookies } from 'next/headers';
// import { logErrorResponse } from '../../_utils/utils';
// import { isAxiosError } from 'axios';
// // import { ApiError } from '../../api';

// export async function GET() {
//   try {
//     const cookieStore = await cookies();

//     const res = await api.get('/api/users/me', {
//       headers: {
//         cookie: cookieStore.toString(),
//       },
//     });
//     return NextResponse.json(res.data, { status: res.status });
//   } catch (error) {
//     if (isAxiosError(error)) {
//       logErrorResponse(error.response?.data);
//       return NextResponse.json(
//         { error: error.message, response: error.response?.data },
//         { status: error.status }
//       );
//     }
//     logErrorResponse({ message: (error as Error).message });
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
