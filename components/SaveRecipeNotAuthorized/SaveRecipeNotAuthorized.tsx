'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import css from './SaveRecipeNotAuthorized.module.css';

type Props = {
  onClose: () => void;
};

export default function SaveRecipeNotAuthorized({ onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={css.backdrop}>
      <div className={css.modal}>
        <button type="button" className={css.closeBtn} onClick={onClose}>
          <svg className={css.closeIcon}>
            <use href="/sprite.svg#close-button" />
          </svg>
        </button>

        <h2 className={css.title}>Error while saving</h2>
        <p className={css.text}>To save this recipe, you need to authorize first</p>

        <div className={css.actions}>
          <Link href="/auth/login" className={css.loginBtn}>
            Log in
          </Link>
          <Link href="/auth/register" className={css.registerBtn}>
            Register
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
