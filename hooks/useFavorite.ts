'use client';

import { useState } from 'react';

import { addRecipeToFavorites, removeRecipeFromFavorites } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

type UseFavoriteProps = {
  recipeId: string;
  initialIsFavorite?: boolean;
};

export const useFavorite = ({ recipeId }: UseFavoriteProps) => {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  // Реальний статус беремо зі списку улюблених користувача (наповнює AuthProvider через getMe),
  // а не з локального стану — тож статус коректний і після перезавантаження сторінки.
  const isFavorite = user?.favorites?.some(f => f.recipeId === recipeId) ?? false;

  const toggleFavorite = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      if (isFavorite) {
        await removeRecipeFromFavorites(recipeId);
        setUser({
          ...user,
          favorites: user.favorites.filter(f => f.recipeId !== recipeId),
        });
      } else {
        await addRecipeToFavorites(recipeId);
        setUser({
          ...user,
          favorites: [...user.favorites, { _id: recipeId, recipeId }],
        });
      }
    } catch (error) {
      // Не даємо помилці впасти як unhandledRejection і зламати сторінку
      console.error('Toggle favorite failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isFavorite, isLoading, toggleFavorite };
};
