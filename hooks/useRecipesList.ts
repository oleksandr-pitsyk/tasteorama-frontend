'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '@/lib/api/clientApi';

export function useRecipesList() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || undefined;
  const category = searchParams.get('category') || undefined;
const ingredient = searchParams.get('ingredient') || undefined;

  const query = useQuery({
    queryKey: ['recipes', page, search, category, ingredient],
    queryFn: () =>
      getRecipes(page, 12, search, category, ingredient)
  });

console.log(query.data);
console.log(query.isError);

 return {
  ...query,
  page,
  recipes: query.isError ? [] : query.data?.data ?? [],
  totalItems: query.isError ? 0 : query.data?.totalItems ?? 0,
  totalPages: query.isError ? 0 : query.data?.totalPages ?? 0,
};
}