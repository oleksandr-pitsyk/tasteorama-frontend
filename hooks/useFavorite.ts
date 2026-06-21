'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

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
    } catch (error: any) {
      console.error('Toggle favorite failed:', error);

      const status = error?.response?.status;

      if (status === 404) {
        toast.error(isFavorite ? 'Recipe not found in favorites' : 'Recipe not found');
      } else if (status === 409) {
        toast.error('Recipe is already in favorites');
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isFavorite, isLoading, toggleFavorite };
};
