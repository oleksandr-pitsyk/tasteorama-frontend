'use client';

import React from 'react';
import styles from './Loading.module.css';

export default function Loading(): React.ReactElement {
  return (
    <div className={styles.loaderContainer}>
      {/* Чистий CSS Спінер, який не потребує встановлення сторонніх бібліотек */}
      <div className={styles.spinner}></div>
      <p className={styles.loaderText}>Loading, please wait...</p>
    </div>
  );
}
