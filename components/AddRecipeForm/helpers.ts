import type { Ingredient } from '@/types/ingredient';
import type { IngredientFormItem } from './types';

type BuildNextIngredientsParams = {
  currentIngredients: IngredientFormItem[];
  selectedIngredientId: string;
  selectedIngredientMeasure: string;
  availableIngredients: Ingredient[];
};

// Повертає лише ті інгредієнти, де заповнені і назва, і кількість.
export function getVisibleIngredients(ingredients: IngredientFormItem[]): IngredientFormItem[] {
  return ingredients.filter(item => item.name.trim().length > 0 && item.measure.trim().length > 0);
}

// Валідує вибір інгредієнта і повертає новий список з доданим елементом.
export function buildNextIngredients({
  currentIngredients,
  selectedIngredientId,
  selectedIngredientMeasure,
  availableIngredients,
}: BuildNextIngredientsParams): IngredientFormItem[] {
  const ingredient = availableIngredients.find(item => item._id === selectedIngredientId);

  if (!ingredient) {
    throw new Error('Оберіть інгредієнт зі списку');
  }

  const exists = currentIngredients.some(item => item.id === ingredient._id);

  if (exists) {
    throw new Error('Цей інгредієнт уже доданий');
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
