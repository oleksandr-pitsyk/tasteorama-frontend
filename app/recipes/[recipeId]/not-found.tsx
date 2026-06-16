'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './not-found.module.css';

export default function NotFoundRecipePage(): React.ReactElement {
  const router = useRouter();

  const handleBackToHome = (): void => {
    router.push('/');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Адаптивний контейнер для 6 видів картинок за макетом */}
      <div className={styles.imageWrapper}>
        <picture className={styles.pictureContainer}>
          {/* Десктоп (від 1440px): 1x та 2x */}
          <source
            media="(min-width: 1440px)"
            srcSet="/images/404/not-found-desktop.webp 1x, /images/404/not-found-desktop@2x.webp 2x"
          />
          {/* Планшет (від 768px): 1x та 2x */}
          <source
            media="(min-width: 768px)"
            srcSet="/images/404/not-found-tablet.webp 1x, /images/404/not-found-tablet@2x.webp 2x"
          />
          {/* Мобілка за замовчуванням (до 767px — Гумова): 1x та 2x */}
          <source srcSet="/images/404/not-found-mobile.webp 1x, /images/404/not-found-mobile@2x.webp 2x" />
          {/* Базовий рендеринг через Next.js Image */}
          <Image
            src="/images/404/not-found-mobile.webp"
            alt="Recipe not found"
            fill
            priority
            className={styles.image}
          />
        </picture>
      </div>

      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.errorMessage}>Recipe not found</p>

      <button type="button" onClick={handleBackToHome} className={styles.backButton}>
        <svg className={styles.arrowIcon}>
          <use href="/sprite.svg#arrow-left" />
        </svg>
        Back to Home
      </button>
    </div>
  );
}
