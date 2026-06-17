'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import css from './Header.module.css';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const burgerIcon = isMenuOpen ? '/sprite.svg#close' : '/sprite.svg#burger';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.headerLink}>
        <Image
          src="/logo.svg"
          alt="Tasteorama"
          className={css.logoIcon}
          width={165}
          height={46}
          priority
        />
      </Link>

      <button
        className={css.burgerButton}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
      >
        <svg className={css.iconBurger} width={32} height={32}>
          <use href={burgerIcon} />
        </svg>
      </button>

      <nav aria-label="Main Navigation" className={`${css.nav} ${isMenuOpen ? css.navOpen : ''}`}>
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link onClick={closeMenu} href="/" className={css.navigationLink}>
              Recipes
            </Link>
          </li>

          {/* Навігація для авторизації та авторизованих користувачів */}
          <AuthNavigation onLinkClick={closeMenu} />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
