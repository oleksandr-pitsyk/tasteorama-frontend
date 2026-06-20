import type { Category } from '@/types/category';
import type { Ingredient } from '@/types/ingredient';
import type { AddRecipeFormValues, CollectionResponse, CreateRecipeResponse } from './types';

type RawCollectionResponse<T> = {
  message?: string;
  data?: T[];
  categories?: T[];
  ingredients?: T[];
};

type RawCreateRecipeResponse = CreateRecipeResponse & {
  id?: string;
  _id?: string;
  recipe?: {
    id?: string;
    _id?: string;
  };
};

function extractRecipeId(payload: RawCreateRecipeResponse): string | null {
  const id =
    payload?.data?._id ??
    payload?.data?.id ??
    payload?._id ??
    payload?.id ??
    payload?.recipe?._id ??
    payload?.recipe?.id;

  return typeof id === 'string' && id.length > 0 ? id : null;
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
  errorMessage: string
): Promise<CollectionResponse<T>> {
  const res = await fetch(url, { method: 'GET' });

  if (!res.ok) {
    throw new Error(errorMessage);
  }

  const data = await safeParseJson<RawCollectionResponse<T>>(res);

  if (!data) {
    throw new Error(errorMessage);
  }

  const items = data.data ?? data.categories ?? data.ingredients;

  if (!Array.isArray(items)) {
    throw new Error(errorMessage);
  }

  return {
    message: data.message ?? 'OK',
    data: items,
  };
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

  const recipeResponse = (await res.json()) as RawCreateRecipeResponse;
  return extractRecipeId(recipeResponse) ?? '';
}
