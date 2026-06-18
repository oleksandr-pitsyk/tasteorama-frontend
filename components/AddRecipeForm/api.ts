import type { Category } from '@/types/category';
import type { Ingredient } from '@/types/ingredient';
import type { AddRecipeFormValues, CollectionResponse, CreateRecipeResponse } from './types';

// парсить тіло відповіді  JSON
async function safeParseJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

// запит
async function fetchCollection<T>(
  url: string,
  errorMessage: string
): Promise<CollectionResponse<T>> {
  const res = await fetch(url, { method: 'GET' });

  if (!res.ok) {
    throw new Error(errorMessage);
  }

  const data = await safeParseJson<CollectionResponse<T>>(res);

  if (!data) {
    throw new Error(errorMessage);
  }

  return data;
}

//  список категорій для селекту
export async function getCategories(): Promise<CollectionResponse<Category>> {
  return fetchCollection<Category>('/api/categories', 'Не вдалося завантажити категорії');
}

//  список інгредієнтів
export async function getIngredients(): Promise<CollectionResponse<Ingredient>> {
  return fetchCollection<Ingredient>('/api/ingredients', 'Не вдалося завантажити інгредієнти');
}

//  FormData, створює рецепт і повертає id запису
export async function createRecipe(values: AddRecipeFormValues): Promise<string> {
  const formData = new FormData();

  formData.append('title', values.title.trim());
  formData.append('category', values.category);
  formData.append('area', 'Ukrainian');
  formData.append('instructions', values.instructions.trim());
  formData.append('description', values.description.trim());
  formData.append('time', values.time.trim());
  formData.append(
    'ingredients',
    JSON.stringify(values.ingredients.map(item => ({ id: item.id, measure: item.measure.trim() })))
  );

  if (values.thumb) {
    formData.append('thumb', values.thumb);
  }

  // бекенд приймає POST саме на /api/recipes 
  const res = await fetch('/api/recipes', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorResponse = (await res.json()) as {
      error?: string;
      response?: { message?: string };
    };
    const message =
      errorResponse?.response?.message ??
      errorResponse?.error ??
      'Помилка під час створення рецепту';

    throw new Error(message);
  }

  const recipeResponse = (await res.json()) as CreateRecipeResponse;
  const recipeId = recipeResponse?.data?._id;

  if (!recipeId) {
    throw new Error('Рецепт створено, але не отримано id');
  }

  return recipeId;
}
