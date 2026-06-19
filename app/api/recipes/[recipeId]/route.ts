// Файл route.ts повинен експортувати функції з назвами, що збігаються з HTTP-методами,
// які ми хочемо обробляти (GET, POST, PUT тощо).
// У цьому випадку ми експортуємо функцію getCategories, яка буде обробляти GET-запити до маршруту /api/categories.

// Імпортуємо необхідні модулі та типи
import { NextResponse } from 'next/server';
import { api, ApiError } from '../../api';

type Props = {
  params: Promise<{ recipeId: string }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    // const cookieStore = await cookies();
    const { recipeId } = await params;
    const res = await api(`/recipes/${recipeId}`);

    // const res = await api(`api/recipes/${recipeId}`, {
    //   headers: {
    //     Cookie: cookieStore.toString(),
    //   },
    // });

    // NextResponse – це розширення стандартного Web Response з додатковими методами Next.js
    // і дозволяє легко повертати JSON-дані.
    // Повертаємо те, що відповів бекенд через метод json
    // return NextResponse.json(data);
    return NextResponse.json(res.data, { status: res.status });
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
