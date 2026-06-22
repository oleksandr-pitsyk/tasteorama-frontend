'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuthStore } from '@/lib/store/authStore';
import Modal from '@/components/Modal/Modal';
import SaveRecipeNotAuthorized from '@/components/SaveRecipeNotAuthorized/SaveRecipeNotAuthorized';

import { useFavorite } from '../../hooks/useFavorite';
import css from './RecipeCard.module.css';

import type { Recipe } from '@/types/recipe';

type RecipeCardProps = {
  recipe: Recipe;
  initialIsFavorite?: boolean;
  recipeType?: 'own' | 'favorites';
};

const RecipeCard = ({ recipe, initialIsFavorite = false, recipeType }: RecipeCardProps) => {
  const { _id, title, thumb, time, description, calories } = recipe;

  const isOwn = recipeType === 'own';

  const [showAuthModal, setShowAuthModal] = useState(false);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const { isFavorite, isLoading, toggleFavorite } = useFavorite({
    recipeId: _id,
    initialIsFavorite,
  });

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    toggleFavorite();
  };

  const handleDeleteClick = () => {
    // TODO: підключити видалення власного рецепту
  };

  return (
    <>
      <article className={css.card}>
        {thumb ? (
          <Image
            src={thumb}
            alt={title}
            width={264}
            height={178}
            sizes="(max-width: 767px) 337px, (max-width: 1439px) 315px, 264px"
            className={css.img}
          />
        ) : (
          <div className={css.imgPlaceholder} aria-hidden="true">
            <svg className={css.placeholderIcon}>
              <use href="/sprite.svg#media" />
            </svg>
          </div>
        )}

        <div className={css.header}>
          <h3 className={css.title}>{title}</h3>

          <span className={css.timeBox}>
            <svg className={css.clockIcon} aria-hidden="true">
              <use href="/sprite.svg#clock" />
            </svg>

            <span className={css.time}>{time ? `${time}` : '—'}</span>
          </span>
        </div>

        <div className={css.desBox}>
          <p>{description}</p>
          <p>{calories ? `~${calories} cals` : 'N/A'}</p>
        </div>

        <div className={css.btnBox}>
          <Link href={`/recipes/${_id}`} className={css.moreBtn}>
            Learn more
          </Link>

          {isOwn ? (
            <button
              type="button"
              onClick={handleDeleteClick}
              className={css.deleteBtn}
              aria-label="Delete recipe"
            >
              <svg className={css.saveIcon} aria-hidden="true">
                <use href="/sprite.svg#trash" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className={`${css.saveBtn} ${isFavorite ? css.active : ''}`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save recipe'}
            >
              {isLoading ? (
                <span className={css.loader} aria-hidden="true" />
              ) : (
                <svg className={css.saveIcon} aria-hidden="true">
                  <use href="/sprite.svg#save" />
                </svg>
              )}
            </button>
          )}
        </div>
      </article>

      {showAuthModal && (
        <Modal onClose={() => setShowAuthModal(false)}>
          <SaveRecipeNotAuthorized />
        </Modal>
      )}
    </>
  );
};

export default RecipeCard;
