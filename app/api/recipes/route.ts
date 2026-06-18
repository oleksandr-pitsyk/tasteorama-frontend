import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { parse } from 'cookie';
import { api } from '../api';
import { logErrorResponse } from '../_utils/utils';

function buildOutgoingFormData(incoming: FormData): FormData {
  const formData = new FormData();
  const fields = ['title', 'category', 'instructions', 'description', 'time', 'ingredients'];

  fields.forEach(field => {
    const value = incoming.get(field);
    if (value) formData.append(field, value);
  });

  const thumb = incoming.get('thumb');
  if (thumb instanceof File) formData.append('image', thumb, thumb.name);

  return formData;
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  // Клонуємо запит для повторної спроби
  const clonedRequest = request.clone();
  const incomingFormData = await request.formData();

  try {
    const res = await api.post('/api/recipes', buildOutgoingFormData(incomingFormData), {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      try {
        const refreshRes = await api.get('/api/auth/refresh', {
          headers: { Cookie: cookieStore.toString() },
        });

        // код оновлення кук ...

        const retryFormData = await clonedRequest.formData();
        const retryRes = await api.post('/api/recipes', buildOutgoingFormData(retryFormData), {
          headers: { Cookie: cookieStore.toString() },
        });

        return NextResponse.json(retryRes.data, { status: retryRes.status });
      } catch {
        return NextResponse.json({ error: 'Сесія застаріла' }, { status: 401 });
      }
    }

    return NextResponse.json(
      { error: 'Bad Request', details: isAxiosError(error) ? error.response?.data : 'Unknown' },
      { status: 400 }
    );
  }
}
