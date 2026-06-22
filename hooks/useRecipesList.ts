'use client';

import { useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getRecipes, getMyRecipes, getFavoriteRecipes } from '@/lib/api/clientApi';

export function useRecipesList(recipeType?: 'own' | 'favorites') {
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const ingredient = searchParams.get('ingredient') ?? undefined;

  const isProfileMode = recipeType === 'own' || recipeType === 'favorites';

  const query = useInfiniteQuery({
    queryKey: isProfileMode
      ? ['recipes', recipeType]
      : ['recipes', { search, category, ingredient }],
    queryFn: ({ pageParam = 1 }) => {
      if (recipeType === 'favorites') return getFavoriteRecipes(pageParam);
      if (recipeType === 'own') return getMyRecipes(pageParam);
      return getRecipes(pageParam, undefined, search, category, ingredient);
    },
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
