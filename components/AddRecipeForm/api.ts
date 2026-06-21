import type { Category } from '@/types/category';
import type { Ingredient } from '@/types/ingredient';
import type { AddRecipeFormValues, CollectionResponse, CreateRecipeResponse } from './types';

function getRecipeIdFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const source = payload as Record<string, unknown>;

  const directId = source._id ?? source.id;
  if (typeof directId === 'string' && directId.length > 0) {
    return directId;
  }

  const data = source.data;
  if (data && typeof data === 'object') {
    const dataRecord = data as Record<string, unknown>;
    const dataId = dataRecord._id ?? dataRecord.id;
    if (typeof dataId === 'string' && dataId.length > 0) {
      return dataId;
    }

    const nestedRecipe = dataRecord.recipe;
    if (nestedRecipe && typeof nestedRecipe === 'object') {
      const nestedRecipeRecord = nestedRecipe as Record<string, unknown>;
      const nestedRecipeId = nestedRecipeRecord._id ?? nestedRecipeRecord.id;
      if (typeof nestedRecipeId === 'string' && nestedRecipeId.length > 0) {
        return nestedRecipeId;
      }
    }
  }

  const recipe = source.recipe;
  if (recipe && typeof recipe === 'object') {
    const recipeRecord = recipe as Record<string, unknown>;
    const recipeId = recipeRecord._id ?? recipeRecord.id;
    if (typeof recipeId === 'string' && recipeId.length > 0) {
      return recipeId;
    }
  }

  return null;
}

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
  errorMessage: string,
  collectionKey?: 'categories' | 'ingredients'
): Promise<CollectionResponse<T>> {
  const res = await fetch(url, { method: 'GET' });

  if (!res.ok) {
    throw new Error(errorMessage);
  }

  const data = await safeParseJson<
    CollectionResponse<T> & {
      categories?: T[];
      ingredients?: T[];
    }
  >(res);

  if (!data) {
    throw new Error(errorMessage);
  }

  const normalizedData =
    data.data ?? (collectionKey ? data[collectionKey] : undefined) ?? ([] as T[]);

  if (!Array.isArray(normalizedData)) {
    throw new Error(errorMessage);
  }

  return {
    message: data.message ?? '',
    data: normalizedData,
  };
}

//  список категорій для селекту
export async function getCategories(): Promise<CollectionResponse<Category>> {
  return fetchCollection<Category>('/api/categories', 'Failed to load categories', 'categories');
}

//  список інгредієнтів
export async function getIngredients(): Promise<CollectionResponse<Ingredient>> {
  return fetchCollection<Ingredient>(
    '/api/ingredients',
    'Failed to load ingredients',
    'ingredients'
  );
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
  if (values.calories.trim()) {
    formData.append('calories', values.calories.trim());
  }
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
    const errorResponse = (await safeParseJson<{
      error?: string;
      response?: { message?: string };
    }>(res)) ?? { error: undefined, response: undefined };
    const message =
      errorResponse?.response?.message ?? errorResponse?.error ?? 'Failed to create recipe';

    throw new Error(message);
  }

  const recipeResponse = (await safeParseJson<CreateRecipeResponse>(res)) ?? null;
  const recipeId = getRecipeIdFromPayload(recipeResponse);

  if (!recipeId) {
    throw new Error('Recipe created but id was not returned');
  }

  return recipeId;
}
