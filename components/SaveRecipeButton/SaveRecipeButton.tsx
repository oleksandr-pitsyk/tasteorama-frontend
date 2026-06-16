'use client';

import { useState } from 'react';
import css from './SaveRecipeButton.module.css';

type SaveRecipeButtonProps = {
  recipeId: string;
  initialFavorite?: boolean;
};

export default function SaveRecipeButton({
  recipeId,
  initialFavorite = false,
}: SaveRecipeButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleClick = async () => {
    console.log('clicked');
    console.log('recipeId:', recipeId);

    setIsFavorite(prev => !prev);
  };

  return (
    <button type="button" onClick={handleClick} className={css.saveButton}>
      {isFavorite ? 'Saved' : 'Save'}

      <svg width="24" height="24" className={css.icon}>
        <use href="/sprite.svg#icon-save" />
      </svg>
    </button>
  );
}
