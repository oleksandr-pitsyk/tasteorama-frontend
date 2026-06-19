'use client';

import { useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getRecipes } from '@/lib/api/clientApi';

export function useRecipesList() {
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const ingredient = searchParams.get('ingredient') ?? undefined;

  const query = useInfiniteQuery({
    queryKey: ['recipes', { search, category, ingredient }],
    queryFn: ({ pageParam = 1 }) =>
      getRecipes(pageParam, undefined, search, category, ingredient),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }

      return undefined;
    },
  });
  const recipes = query.data?.pages.flatMap(page => page.data) ?? [];
  const totalItems = query.data?.pages[0]?.totalItems ?? 0;

  const isNotFound =
    query.isError &&
    'response' in query.error &&
    (query.error as { response?: { status: number } }).response?.status === 404;

  return {
    ...query,
    recipes,
    totalItems,
    isNotFound,
  };
}