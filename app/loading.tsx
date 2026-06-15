'use client';

import React from 'react';
import styles from './Loading.module.css';

export default function Loading(): React.ReactElement {
  return (
    <div className={styles.loaderContainer}>
      {/* Чистый CSS Спинер, который не требует установки библиотек */}
      <div className={styles.spinner}></div>
      <p className={styles.loaderText}>Loading, please wait...</p>
    </div>
  );
}
