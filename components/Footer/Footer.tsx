'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* ЛОГОТИП: Теперь с официальной SVG-иконкой из спрайта */}
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.svg"
            alt="Tasteorama"
            className={styles.logoIcon}
            width={32}
            height={30}
            priority
          />
          <span className={styles.logoText}>Tasteorama</span>
        </Link>

        {/* Копірайт */}
        <p className={styles.copyright}>© {currentYear} CookingCompanion. All rights reserved.</p>

        {/* Елементи навігації */}
        <nav className={styles.nav}>
          <Link href="/recipes" className={styles.link}>
            Recipes
          </Link>
          <Link href="/profile" className={styles.link}>
            Account
          </Link>
        </nav>
      </div>
    </footer>
  );
}
