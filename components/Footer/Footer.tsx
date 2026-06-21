'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

// Імпорт авторизації зі стору
import { useAuthStore } from '@/lib/store/authStore';

export default function Footer(): React.ReactElement {
  // Отримання значення поточного року для вставки в Копірайт
  const currentYear = new Date().getFullYear();

  // Отримання даних зі стану авторизації
  // const user = useAuthStore(state => state.user);
  // Отримання даних зі стану авторизації
  // Функція -
  const isOpenRegisterLoginForm = useAuthStore(state => state.isOpenRegisterLoginForm);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  // const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* ЛОГОТИП: Теперь с официальной SVG-иконкой из спрайта */}
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.svg"
            alt="Tasteorama"
            className={styles.logoIcon}
            width={165}
            height={46}
            priority
          />
        </Link>

        {/* Копірайт */}
        <p className={styles.copyright}>© {currentYear} CookingCompanion. All rights reserved.</p>

        {/* Елементи навігації */}
        <nav className={styles.nav}>
          {/* Перехід на сторінку з рецептами - основна сторінка */}
          <Link href="/" className={styles.link}>
            Recipes
          </Link>
          {/* Перехід на сторінку профіля користувача. 
          Якщо користувач НЕ авторизований, в результаті кліку по даному елементу повинно відкритись модальне вікно з елементами навігації на сторінки логіну та реєстрації. */}
          {!isOpenRegisterLoginForm && (
            <Link href={!isAuthenticated ? '/auth/login' : '/profile'} className={styles.link}>
              Account
            </Link>
          )}
        </nav>
      </div>
    </footer>
  );
}
