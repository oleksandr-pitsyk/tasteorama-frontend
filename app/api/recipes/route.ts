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
    const { data } = await api(`api/recipes?${searchParams.toString()}`);

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
    const category = incomingFormData.get('category');
    const area = incomingFormData.get('area');
    const instructions = incomingFormData.get('instructions');
    const description = incomingFormData.get('description');
    const time = incomingFormData.get('time');
    const ingredients = incomingFormData.get('ingredients');
    const thumb = incomingFormData.get('thumb');

    if (typeof title === 'string') formData.append('title', title);
    if (typeof category === 'string') formData.append('category', category);
    if (typeof area === 'string') formData.append('area', area);
    if (typeof instructions === 'string') formData.append('instructions', instructions);
    if (typeof description === 'string') formData.append('description', description);
    if (typeof time === 'string') formData.append('time', time);
    if (typeof ingredients === 'string') formData.append('ingredients', ingredients);
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
