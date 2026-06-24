// app/error.tsx

'use client';

import styles from './error.module.css';
import { GoArrowUpRight } from 'react-icons/go';

type Props = {
  error: Error;
  reset: () => void;
};

const Error = ({ error, reset }: Props) => {
  return (
    <section className={styles.page}>
      <div className={styles.bgNumber} aria-hidden="true">
        <span>5</span>
        <span>0</span>
        <span>0</span>
      </div>

      <div className={styles.scanlines} aria-hidden="true" />

      <div className={styles.content}>
        <span className={styles.label}>Error — 500</span>

        <h1 className={styles.title}>
          Something went
          <br />
          <em>wrong.</em>
        </h1>

        <p className={styles.sub}>{error.message}</p>

        <button onClick={reset} className={styles.btn}>
          Try again <GoArrowUpRight className={styles.iconArrow} />
        </button>
      </div>

      <span className={styles.vertLabel} aria-hidden="true">
        500 — Server Error
      </span>
    </section>
  );
};

export default Error;
