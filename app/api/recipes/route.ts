// Файл route.ts повинен експортувати функції з назвами, що збігаються з HTTP-методами,
// які ми хочемо обробляти (GET, POST, PUT тощо).
// У цьому випадку ми експортуємо функцію getCategories, яка буде обробляти GET-запити до маршруту /api/categories.

// Імпортуємо необхідні модулі та типи
import { NextResponse } from 'next/server';
import { api, ApiError } from '../api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { data } = await api(
      `api/recipes?${searchParams.toString()}`
    );

    // NextResponse – це розширення стандартного Web Response з додатковими методами Next.js
    // і дозволяє легко повертати JSON-дані.
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
