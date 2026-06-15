// ==========================================================================================
// / – головна сторінка з загальною інформацією про застосунок.
// ==========================================================================================
// import Image from 'next/image';
// ------------------------------------------------------------------------------------------

// Імпорт модуля зі стилями компонента

import css from './MainPage.module.css';

// Імпорт компонентів
// import SearchBox from '@/components/SearchBox/SearchBox';
import Filters from '@/components/Filters/Filters';
import RecipesList from '@/components/RecipesList/RecipesList';
import RecipeCard from '@/components/RecipeCard/RecipeCard';
import LoadMoreBtn from '@/components/LoadMoreBtn/LoadMoreBtn';

function MainPage() {
  return (
    <main className={css.container}>
      <h1 className={css.title}>Tasteorama</h1>
      {/* <SearchBox /> */}
      <Filters />
      <RecipesList />
      <RecipeCard />
      <LoadMoreBtn />
    </main>
  );
}

export default MainPage;
