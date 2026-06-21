export type IngredientFormItem = {
  id: string;
  measure: string;
  name: string;
};

export type AddRecipeFormValues = {
  title: string;
  description: string;
  time: string;
  calories: string;
  category: string;
  ingredients: IngredientFormItem[];
  selectedIngredientId: string;
  selectedIngredientMeasure: string;
  instructions: string;
  thumb: File | null;
};

export type CollectionResponse<T> = {
  message: string;
  data: T[];
};

export type CreateRecipeResponse = {
  message?: string;
  _id?: string;
  id?: string;
  recipe?: {
    _id?: string;
    id?: string;
  };
  data?: {
    _id?: string;
    id?: string;
    recipe?: {
      _id?: string;
      id?: string;
    };
  };
};
