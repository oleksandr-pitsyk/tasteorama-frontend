'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { useFavorite } from '@/hooks/useFavorite';
import { getIngredients } from '@/lib/api/clientApi';
import { Recipe } from '@/types/recipe';
import styles from './RecipeDetails.module.css';

type Props = {
  recipe: Recipe;
};

export default function RecipeDetails({ recipe }: Props) {
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, isLoading, toggleFavorite } = useFavorite({ recipeId: recipe._id });

  // Інгредієнти рецепту зберігаються як { id, measure } — id це ObjectId.
  // Тягнемо колекцію інгредієнтів, щоб показати назву замість id.
  // Власний ключ кешу, щоб не конфліктувати з ['ingredients'] в AddRecipeForm,
  // який повертає інший формат даних (об'єкт, а не масив).
  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredients', 'details'],
    queryFn: getIngredients,
  });

  const getIngredientName = (id: string) =>
    (Array.isArray(ingredients) ? ingredients : []).find(ingredient => ingredient._id === id)
      ?.name ?? id;

  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      // TODO: відкрити модалку
      return;
    }
    // Спільна логіка з картками рецептів: читає реальний статус зі стора,
    // додає/видаляє з улюблених і не падає 400 на вже збереженому рецепті.
    toggleFavorite();
  };

  const infoCard = (
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

  const saveButton = (
    <button
      className={`${styles.saveBtn} ${isFavorite ? styles.saveBtnActive : ''}`}
      onClick={handleSaveToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          {isFavorite ? 'Unsave' : 'Save'}
          <svg className={styles.saveIcon}>
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

      {/*
        Mobile: infoCard зверху, saveButton знизу — колонка
        Tablet: infoCard зліва, saveButton справа — рядок
        Desktop: цей блок прихований, замість нього aside
      */}
      <div className={styles.infoRowMobile}>
        {infoCard}
        {saveButton}
      </div>

      {/* Текстовий контент */}
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
                  • {getIngredientName(item.id)} — {item.measure}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Preparation Steps:</h2>
            <p className={styles.text}>{recipe.instructions}</p>
          </section>
        </div>

        {/* Aside — тільки на desktop, з infoCard і saveButton */}
        <aside className={styles.aside}>
          {infoCard}
          {saveButton}
        </aside>
      </div>
    </div>
  );
}
