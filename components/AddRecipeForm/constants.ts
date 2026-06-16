import type { AddRecipeFormValues } from './types';

export const initialValues: AddRecipeFormValues = {
  title: '',
  description: '',
  time: '',
  calories: '',
  category: '',
  ingredients: [],
  selectedIngredientId: '',
  selectedIngredientMeasure: '',
  instructions: '',
  thumb: null,
};
