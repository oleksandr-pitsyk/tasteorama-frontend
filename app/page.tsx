// ==========================================================================================
// / – головна сторінка з загальною інформацією про застосунок.
// ==========================================================================================
// import Image from 'next/image';
// ------------------------------------------------------------------------------------------

// Імпорт модуля зі стилями компонента

import css from './MainPage.module.css';

// Імпорт компонента
import SearchBox from '@/components/SearchBox/SearchBox';
import Filters from '@/components/Filters/Filters';

function MainPage() {
  return (
    <main className={css.container}>
      <h1 className={css.title}>Tasteorama</h1>
      {/* <SearchBox /> */}
      <Filters />
    </main>
  );
}

export default MainPage;
