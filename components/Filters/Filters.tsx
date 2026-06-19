'use client';

import css from './Filters.module.css';
import FiltersControls from './FiltersControls';
import { Category } from '@/types/category';
import { Ingredient } from '@/types/ingredient';
import { getCategories, getIngredients } from '@/lib/api/clientApi';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FC, useCallback, useState } from 'react';
import Loading from '@/app/loading';
import { resetSearchAndFilters } from './helpers';

interface FiltersProps {
  totalItems: number;
}

const Filters: FC<FiltersProps> = ({ totalItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['filters-categories'],
    queryFn: async () => {
      return await getCategories()
    },
  });

  const { data: ingredients = [], isLoading: isIngredientsLoading } = useQuery<Ingredient[]>({
    queryKey: ['filters-ingredients'],
    queryFn: async () => {
      return await getIngredients()
    },
  });

  const categoryParams = searchParams.get('category');
  const ingredientParams = searchParams.get('ingredient');

  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const queryString = params.toString();

      router.replace(queryString ? `?${queryString}` : '');
    },
    [searchParams, router]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      updateURL({
        category: value || null,
      });

      if (value && ingredientParams) {
        setIsOpen(false);
      }
    },
    [updateURL, ingredientParams]
  );

  const handleIngredientChange = useCallback(
    (value: string) => {
      updateURL({
        ingredient: value || null,
      });

      if (categoryParams && value) {
        setIsOpen(false);
      }
    },
    [updateURL, categoryParams]
  );

  const handleResetSearchAndFilters = () => {
    resetSearchAndFilters(new URLSearchParams(searchParams), router);
  };

  if (isCategoriesLoading || isIngredientsLoading) {
    return <Loading />;
  }

  return (
    <section className={`${css.wrapper} container`}>
      <div className={css.mobileHeader}>
        <div className={css.topRow}>
          <p className={css.counter}>{totalItems} recipes</p>

          {!isOpen && (
            <button className={css.filtersButton} onClick={() => setIsOpen(true)}>
              <svg width={20} height={20}>
                <use href="/sprite.svg#filter"></use>
              </svg>
              Filters
            </button>
          )}
        </div>

        {isOpen && (
          <div className={css.mobileFilters}>
            <div className={css.mobileFiltersHeader}>
              <p className={css.textFiltersButton}>Filters</p>

              <button type="button" className={css.closeButton} onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <FiltersControls
              categoryParams={categoryParams}
              ingredientParams={ingredientParams}
              categories={categories}
              ingredients={ingredients}
              handleCategoryChange={handleCategoryChange}
              handleIngredientChange={handleIngredientChange}
              handleResetSearchAndFilters={handleResetSearchAndFilters}
            />
          </div>
        )}
      </div>

      <div className={css.desktopHeader}>
        <p className={css.counter}>{totalItems} recipes</p>

        <FiltersControls
          categoryParams={categoryParams}
          ingredientParams={ingredientParams}
          categories={categories}
          ingredients={ingredients}
          handleCategoryChange={handleCategoryChange}
          handleIngredientChange={handleIngredientChange}
          handleResetSearchAndFilters={handleResetSearchAndFilters}
        />
      </div>
    </section>
  );
};

export default Filters;
