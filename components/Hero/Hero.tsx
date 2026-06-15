// Імпорт компонента Link з Next.js - Для створення посилань
// import Link from 'next/link';

// Імпорт стилів з модуля стилів
import css from './Hero.module.css';

// import SearchBox from '../SearchBox/SearchBox';

// Імпорт компонента AuthNavigation
// import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';

const Hero = () => {
  return (
    <section className={css.hero}>
      <h3>Hero</h3>
      {/* <SearchBox /> */}
    </section>
  );
};

export default Hero;
