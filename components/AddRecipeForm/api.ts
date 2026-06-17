import type { Category } from '@/types/category';
import type { Ingredient } from '@/types/ingredient';
import type { AddRecipeFormValues, CollectionResponse, CreateRecipeResponse } from './types';

// Безпечно парсить тіло відповіді як JSON.
// fetch не гарантує, що тіло непорожнє і є валідним JSON —
// порожнє тіло (наприклад при 204, або при помилці без body)
// викликає "Unexpected end of JSON input" при прямому res.json().
async function safeParseJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // Тіло є, але це не JSON (наприклад HTML-сторінка помилки) —
    // повертаємо null, виклик нижче сформує власне повідомлення.
    return null;
  }
}

// GET-запит до колекції та повертає типізовані дані або помилку.
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

// Завантажує список категорій для селекту
export async function getCategories(): Promise<CollectionResponse<Category>> {
  return fetchCollection<Category>('/api/categories', 'Не вдалося завантажити категорії');
}

// Завантажує список  інгредієнтів
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

  // ВАЖЛИВО: бекенд приймає POST саме на /api/recipes (дивись Swagger:
  // "POST /api/recipes — Створити новий рецепт"). Шлях /api/recipes/my
  // призначений для GET-запиту власних рецептів користувача, а не для
  // створення нового — саме тому раніше прилітала помилка "Route not found".
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
