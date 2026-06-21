import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '../../../api';
import { logErrorResponse } from '../../../_utils/utils';

type Props = {
  params: Promise<{ recipeId: string }>;
};

// POST /api/recipes/favorites/:recipeId — додати рецепт до улюблених
export async function POST(_request: NextRequest, { params }: Props) {
  try {
    const { recipeId } = await params;
    const cookieStore = await cookies();

    const res = await api.post(`/recipes/favorites/${recipeId}`, null, {
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

// DELETE /api/recipes/favorites/:recipeId — видалити рецепт з улюблених
export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { recipeId } = await params;
    const cookieStore = await cookies();

    const res = await api.delete(`/recipes/favorites/${recipeId}`, {
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
