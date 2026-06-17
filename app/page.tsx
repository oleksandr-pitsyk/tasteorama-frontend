'use client';
// ==========================================================================================
// / – головна сторінка з загальною інформацією про застосунок.
// ==========================================================================================
// import Image from 'next/image';
// ------------------------------------------------------------------------------------------

// Імпорт hook 

import { useRecipesList } from '@/hooks/useRecipesList';
import SearchResultsTitle from '@/components/RecipesList/SeacrhResultsTitle';

// Імпорт модуля зі стилями компонента

import css from './MainPage.module.css';

// Імпорт компонентів

import Hero from '@/components/Hero/Hero';
import Filters from '@/components/Filters/Filters';
import RecipesList from '@/components/RecipesList/RecipesList';
// import RecipeCard from '@/components/RecipeCard/RecipeCard';
// import LoadMoreBtn from '@/components/LoadMoreBtn/LoadMoreBtn';

// import HeaderMy from '@/components/HeaderMy/HeaderMy';
// import MyTest from '@/components/MyTest/MyTest';

function MainPage() {
  const { totalItems } = useRecipesList()
  return (
    <main className={css.container}>
      <Hero />
      <SearchResultsTitle />
      <Filters totalItems={totalItems}/>
      <RecipesList />
      {/* <RecipeCard /> */}
      {/* <LoadMoreBtn /> */}
      {/* <HeaderMy /> */}
      {/* <MyTest /> */}
    </main>
  );
}

export default MainPage;
