'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

import RecipeCard from '@/components/RecipeCard/RecipeCard';
import LoadMoreBtn from '@/components/LoadMoreBtn/LoadMoreBtn';
import { NoSearchResults } from '@/components/Filters/NoSearchResults';

import css from './RecipesList.module.css';
import Loading from '@/app/loading';
import AppError from '@/app/error';

import { resetSearchAndFilters } from '@/components/Filters/helpers';
import { useRecipesList } from '@/hooks/useRecipesList';

type RecipesListProps = {
  // Переданий проп → режим профілю (власні / улюблені); без нього → головна сторінка
  recipeType?: 'own' | 'favorites';
};

const RecipesList = ({ recipeType }: RecipesListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isProfileMode = recipeType === 'own' || recipeType === 'favorites';

  const handleResetSearchAndFilters = () => {
    resetSearchAndFilters(searchParams, router);
  };

  const {
    recipes,
    totalItems,
    isLoading,
    isError,
    error,
    refetch,
    isNotFound,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useRecipesList(recipeType);

  useEffect(() => {
    // Тост "не знайдено" лише на головній (пошук), не в профілі
    if (isNotFound && !isProfileMode) {
      toast.error('No recipes found');
    }
  }, [isNotFound, isProfileMode]);

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

  // Порожній список у профілі — нормальна ситуація → дружнє повідомлення
  if (isProfileMode && recipes.length === 0) {
    return (
      <p className={css.empty}>
        {recipeType === 'favorites'
          ? "You don't have any saved recipes yet."
          : "You haven't added any recipes yet."}
      </p>
    );
  }

  return (
    <div className={css.wrapper}>
      {/* Лічильник "N recipes" — лише в профілі */}
      {isProfileMode && <p className={css.count}>{totalItems} recipes</p>}

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

          {hasNextPage && (
            <LoadMoreBtn onClick={fetchNextPage} isLoading={isFetchingNextPage} />
          )}
        </>
      )}
    </div>
  );
};

export default RecipesList;
