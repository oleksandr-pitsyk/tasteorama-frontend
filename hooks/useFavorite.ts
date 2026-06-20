'use client';

import { useState } from 'react';

import { addRecipeToFavorites, removeRecipeFromFavorites } from '@/lib/api/clientApi';

type UseFavoriteProps = {
  recipeId: string;
  initialIsFavorite?: boolean;
};

export const useFavorite = ({ recipeId, initialIsFavorite = false }: UseFavoriteProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    try {
      setIsLoading(true);

      if (isFavorite) {
        await removeRecipeFromFavorites(recipeId);
        setIsFavorite(false);
      } else {
        await addRecipeToFavorites(recipeId);
        setIsFavorite(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isFavorite, isLoading, toggleFavorite };
};
