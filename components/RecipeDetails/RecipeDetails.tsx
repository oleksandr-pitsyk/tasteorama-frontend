'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { Recipe } from '@/types/recipe';
import styles from './RecipeDetails.module.css';

type Props = {
  recipe: Recipe;
};

export default function RecipeDetails({ recipe }: Props) {
  const { isAuthenticated } = useAuthStore();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      // TODO: відкрити модалку
      return;
    }
    setIsLoading(true);
    try {
      if (isSaved) {
        await fetch(`/api/recipes/favorites/${recipe._id}`, { method: 'DELETE' });
        setIsSaved(false);
      } else {
        await fetch(`/api/recipes/favorites/${recipe._id}`, { method: 'POST' });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const InfoCard = () => (
    <div className={styles.infoCard}>
      <h3 className={styles.infoTitle}>General informations</h3>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Category:</span>
        <span className={styles.infoValue}>{recipe.category}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Cooking time:</span>
        <span className={styles.infoValue}>{recipe.time} minutes</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Caloric content:</span>
        <span className={styles.infoValue}>—</span>
      </div>
    </div>
  );

  const SaveButton = () => (
    <button
      className={`${styles.saveBtn} ${isSaved ? styles.saveBtnActive : ''}`}
      onClick={handleSaveToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          {isSaved ? 'Unsave' : 'Save'}
          <svg width="20" height="20" className={styles.saveIcon}>
            <use href="/sprite.svg#save" />
          </svg>
        </>
      )}
    </button>
  );

  return (
    <div className={styles.wrapper}>
      {/* Заголовок — завжди над картинкою */}
      <h1 className={styles.title}>{recipe.title}</h1>

      {/* Фото */}
      <div className={styles.imageWrapper}>
        <Image
          src={recipe.thumb || '/images/placeholder.jpg'}
          alt={recipe.title}
          fill
          className={styles.image}
          priority
        />
      </div>

      {/* Mobile/Tablet: General info + кнопка під картинкою */}
      <div className={styles.infoRowMobile}>
        <InfoCard />
        <SaveButton />
      </div>

      {/* Desktop: два стовпці */}
      <div className={styles.desktopLayout}>
        <div className={styles.textContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About recipe</h2>
            <p className={styles.text}>{recipe.description}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ingredients:</h2>
            <ul className={styles.ingredientsList}>
              {recipe.ingredients.map((item, index) => (
                <li key={index} className={styles.ingredientItem}>
                  • {item.id} — {item.measure}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Preparation Steps:</h2>
            <p className={styles.text}>{recipe.instructions}</p>
          </section>
        </div>

        <aside className={styles.aside}>
          <InfoCard />
          <SaveButton />
        </aside>
      </div>
    </div>
  );
}
