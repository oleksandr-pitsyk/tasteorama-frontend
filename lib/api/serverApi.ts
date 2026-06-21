import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { nextServer } from './api';

import { User } from '@/types/user';

type CheckSessionRequest = {
  success: boolean;
};

export const checkSessionServer = async () => {
  const cookieStore = await cookies();

  try {
    const res = await nextServer.get<CheckSessionRequest>('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return res;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
};

export const getMeServer = async () => {
  const cookieStore = await cookies();

  const res = await nextServer.get<User>('/auth/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
};
