import { NextResponse } from 'next/server';
import { api, ApiError } from '../../api';
import { cookies } from 'next/headers';

type Props = {
  params: Promise<{ recipeId: string }>;
};

// GET /api/recipes/:recipeId — деталі рецепту (публічний маршрут)
export async function GET(_request: Request, { params }: Props) {
  try {
    const { recipeId } = await params;
    const res = await api.get(`/recipes/${recipeId}`);
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: (error as ApiError).response?.data?.error ?? (error as ApiError).message },
      { status: (error as ApiError).status }
    );
  }
}

// DELETE /api/recipes/:recipeId — видалення власного рецепту (приватний маршрут)
export async function DELETE(_request: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { recipeId } = await params;
    const res = await api.delete(`/recipes/${recipeId}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: (error as ApiError).response?.data?.error ?? (error as ApiError).message },
      { status: (error as ApiError).status }
    );
  }
}
