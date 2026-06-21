'use client';

import { useSearchParams } from 'next/navigation';
import css from '@/components/RecipesList/SeacrhResultsTitle.module.css';

export default function SearchResultsTitle() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');


  return (
  <div className={`${css.TitleResults} container`}>
    <h2 className={css.h2}>
    {search ? `Search Results for "${search}"` : 'Recipes'}
  </h2>
  </div>
);
}
