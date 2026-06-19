'use client';

import css from './Hero.module.css';
import SearchBox from '../SearchBox/SearchBox';
import { useSearchParams } from 'next/navigation';

const Hero = () => {
  const searchParams = useSearchParams();
  return (
    <section className={css.hero}>
      <div className={css.content}>
        <h1 className={css.title}>
          Plan, Cook, and
          <br />
          Share Your Flavors
        </h1>

        <SearchBox key={searchParams.get('search') ?? ''} />
      </div>
    </section>
  );
};

export default Hero;
