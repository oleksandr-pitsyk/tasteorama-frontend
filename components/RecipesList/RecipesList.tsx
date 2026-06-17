'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import RecipeCard from '@/components/RecipeCard/RecipeCard';
import LoadMoreBtn from '@/components/LoadMoreBtn/LoadMoreBtn';
import { NoSearchResults } from '@/components/Filters/NoSearchResults';

import css from './RecipesList.module.css';
import Loading from '@/app/loading';
import AppError from '@/app/error';

import { resetSearchAndFilters } from '@/components/Filters/helpers';
import { useRecipesList } from '@/hooks/useRecipesList';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

const RecipesList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleResetSearchAndFilters = () => {
    resetSearchAndFilters(searchParams, router);
  };

  const {
    recipes,
    isLoading,
    isError,
    error,
    refetch,
    isNotFound,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useRecipesList();

  useEffect(() => {
    if (isNotFound) {
      toast.error('No recipes found');
    }
  }, [isNotFound]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError && !isNotFound) {
    return (
      <AppError
        error={error instanceof Error ? error : new Error('Something went wrong')}
        reset={() => refetch()}
      />
    );
  }

  return (
    <div className={css.wrapper}>
      {isNotFound ? (
        <NoSearchResults onReset={handleResetSearchAndFilters} />
      ) : (
        <>
          <ul className={css.list}>
            {recipes.map(recipe => (
              <li key={recipe._id} className={css.item}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </ul>

          {hasNextPage && <LoadMoreBtn onClick={fetchNextPage} isLoading={isFetchingNextPage} />}
        </>
      )}
    </div>
  );
};

export default RecipesList;
