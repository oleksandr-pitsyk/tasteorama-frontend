'use client';

import Link from 'next/link';
import css from './RecipeCard.module.css';

import type { Recipe } from '@/types/recipe';

type RecipeCardProps = {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (recipeId: string) => void;
};

const RecipeCard = ({ recipe, isFavorite = false, onToggleFavorite }: RecipeCardProps) => {
  const { _id, title, thumb, time, description } = recipe;

  return (
    <div className={css.card}>
      <img src={thumb} alt={title} loading="lazy" className={css.img} />

      <div className={css.header}>
        <h3 className={css.title}>{title}</h3>

        <span className={css.timeBox}>
          <span>⏱</span>
          <p className={css.time}>{time ? `${time} min` : '—'}</p>
        </span>
      </div>

      <div className={css.desBox}>
        <p className={css.des}>{description}</p>
      </div>

      <div className={css.btnBox}>
        <Link href={`/recipes/${_id}`} className={css.moreBtn}>
          Learn more
        </Link>

        <button
          type="button"
          onClick={() => onToggleFavorite?.(_id)}
          className={`${css.saveBtn} ${isFavorite ? css.active : ''}`}
          aria-label="Save recipe"
        >
          ♡
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;