// ===========================================================================================
// Файл route.ts повинен експортувати функції з назвами, що збігаються з HTTP-методами,
// які ми хочемо обробляти (GET, POST, PUT тощо).
// ===========================================================================================

// Імпортуємо необхідні модулі та типи
// NextResponse – це розширення стандартного Web Response з додатковими методами Next.js
// і дозволяє легко повертати JSON-дані.
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api, ApiError } from '../api';
import { logErrorResponse } from '../_utils/utils';

// GET /api/recipes — отримання списку рецептів з можливістю фільтрації
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { data } = await api(`/api/recipes?${searchParams.toString()}`);

    // Повертаємо те, що відповів бекенд через метод json
    return NextResponse.json(data);
  } catch (error) {
    // У випадку помилки — повертаємо обʼєкт з помилкою
    return NextResponse.json(
      {
        error: (error as ApiError).response?.data?.error ?? (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }
}

// POST /api/recipes — створення нового рецепту.
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const incomingFormData = await request.formData();

    const formData = new FormData();

    const title = incomingFormData.get('title');
    const description = incomingFormData.get('description');
    const time = incomingFormData.get('time');
    const calories = incomingFormData.get('calories');
    const category = incomingFormData.get('category');
    const ingredients = incomingFormData.get('ingredients');
    const instructions = incomingFormData.get('instructions');
    const thumb = incomingFormData.get('thumb');

    if (typeof title === 'string') formData.append('title', title);
    if (typeof description === 'string') formData.append('description', description);
    if (typeof time === 'string') formData.append('time', time);
    if (typeof calories === 'string') formData.append('calories', calories);
    if (typeof category === 'string') formData.append('category', category);
    if (typeof ingredients === 'string') formData.append('ingredients', ingredients);
    if (typeof instructions === 'string') formData.append('instructions', instructions);
    if (thumb instanceof File) formData.append('image', thumb, thumb.name);

    const res = await api.post('/api/recipes', formData, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status || 500 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { isAxiosError } from 'axios';
// import { parse } from 'cookie';
// import { api } from '../api';
// import { logErrorResponse } from '../_utils/utils';

// function buildOutgoingFormData(incoming: FormData): FormData {
//   const formData = new FormData();
//   const fields = ['title', 'category', 'instructions', 'description', 'time', 'ingredients'];

//   fields.forEach(field => {
//     const value = incoming.get(field);
//     if (value) formData.append(field, value);
//   });

//   const thumb = incoming.get('thumb');
//   if (thumb instanceof File) formData.append('image', thumb, thumb.name);

//   return formData;
// }

// export async function POST(request: NextRequest) {
//   const cookieStore = await cookies();

//   // Клонуємо запит для повторної спроби
//   const clonedRequest = request.clone();
//   const incomingFormData = await request.formData();

//   try {
//     const res = await api.post('/api/recipes', buildOutgoingFormData(incomingFormData), {
//       headers: { Cookie: cookieStore.toString() },
//     });
//     return NextResponse.json(res.data, { status: res.status });
//   } catch (error) {
//     if (isAxiosError(error) && error.response?.status === 401) {
//       try {
//         const refreshRes = await api.get('/api/auth/refresh', {
//           headers: { Cookie: cookieStore.toString() },
//         });

//         // код оновлення кук ...

//         const retryFormData = await clonedRequest.formData();
//         const retryRes = await api.post('/api/recipes', buildOutgoingFormData(retryFormData), {
//           headers: { Cookie: cookieStore.toString() },
//         });

//         return NextResponse.json(retryRes.data, { status: retryRes.status });
//       } catch {
//         return NextResponse.json({ error: 'Сесія застаріла' }, { status: 401 });
//       }
//     }

//     return NextResponse.json(
//       { error: 'Bad Request', details: isAxiosError(error) ? error.response?.data : 'Unknown' },
//       { status: 400 }
//     );
//   }
// }
