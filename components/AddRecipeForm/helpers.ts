import type { Ingredient } from '@/types/ingredient';
import type { IngredientFormItem } from './types';

type BuildNextIngredientsParams = {
  currentIngredients: IngredientFormItem[];
  selectedIngredientId: string;
  selectedIngredientMeasure: string;
  availableIngredients: Ingredient[];
};

// повертає інгредієнти, де заповнені і назва кільк.
export function getVisibleIngredients(ingredients: IngredientFormItem[]): IngredientFormItem[] {
  return ingredients.filter(item => item.name.trim().length > 0 && item.measure.trim().length > 0);
}

// валідує вибір інгредієнта і повертає новий список
export function buildNextIngredients({
  currentIngredients,
  selectedIngredientId,
  selectedIngredientMeasure,
  availableIngredients,
}: BuildNextIngredientsParams): IngredientFormItem[] {
  const ingredient = availableIngredients.find(item => item._id === selectedIngredientId);

  if (!ingredient) {
    throw new Error('Please select an ingredient');
  }

  const exists = currentIngredients.some(item => item.id === ingredient._id);

  if (exists) {
    throw new Error('This ingredient has already been added');
  }

  if (selectedIngredientMeasure.trim().length > 10) {
    throw new Error('Amount must not exceed 10 characters');
  }

  return [
    ...currentIngredients,
    {
      id: ingredient._id,
      name: ingredient.name,
      measure: selectedIngredientMeasure.trim(),
    },
  ];
}
