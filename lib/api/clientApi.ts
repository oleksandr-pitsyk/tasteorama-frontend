// ==========================================================================================
// Функції для виконання HTTP-запитів
// ==========================================================================================

import { nextServer } from './api';
import { isAxiosError } from 'axios';

// Імпорт інтерфейсів
import type { User } from '@/types/user';
import type { Category } from '@/types/category';
import type { Ingredient } from '@/types/ingredient';
// ==========================================================================================
// register : реєстрація користувача
// ==========================================================================================
// Структура запиту :

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

// ==========================================================================================
// login : Вхід користувача в систему (логін)
// ==========================================================================================
// Структура запиту :

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

// ==========================================================================================
// logout : Вихід користувача з системи (логаут)
// ==========================================================================================
export const logout = async (): Promise<void> => {
  const res = await nextServer.post('/auth/logout');
  return res.data;
};

// ==========================================================================================
// getMe : Отримання об’єкта користувача (профілю) для авторизованого користувача
// ==========================================================================================

export const getMe = async () => {
  const res = await nextServer.get<User>('/auth/me');
  return res.data;
};

// ==========================================================================================
// checkSession : Перевірка сесії користувача (чи він авторизований)
// ==========================================================================================
type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

// *********************************************************************************
// Робота з категоріями
// *********************************************************************************
// Типізація відповіді Get-запиту від Axios - згідно структури бекенда :
// interface GetCategoriesHttpResponse {
//   data: Category[]; // Відповідь містить масив категорій у властивості data
// }
// ==========================================================================================
// getCategories : виконує запит для отримання колекції категорій із сервера.
// ==========================================================================================
// Структура запиту :

interface getCategoriesResponse {
  categories: Category[];
}

export async function getCategories(): Promise<Category[]> {
  // Виконуємо HTTP-запит
  const response = await nextServer.get<getCategoriesResponse>('/categories');
  console.log('Fetch - GET getCategories :');
  console.log('response', response);
  console.log('response.data', response.data);
console.log(response.data);
  // Повертаємо значення відповіді
  return response.data.categories;
}

// *********************************************************************************
// Робота з інгредієнтами
// *********************************************************************************

// Типізація відповіді Get-запиту від Axios - згідно структури бекенда :
// interface GetCategoriesHttpResponse {
//   data: Ingredient[]; // Відповідь містить масив категорій у властивості data
// }
// ==========================================================================================
// getIngredients : виконує запит для отримання колекції інгредієнтів із сервера.
// ==========================================================================================
// Структура запиту :

interface getIngredientsResponse {
  ingredients: Ingredient[];
}

export async function getIngredients(): Promise<Ingredient[]> {
  // Виконуємо HTTP-запит
  const response = await nextServer.get<getIngredientsResponse>('/ingredients');
  console.log('Fetch - GET getIngredients :');
  console.log('response', response);
  console.log('response.data', response.data);

  // Повертаємо значення data відповіді
  return response.data.ingredients;
}

// *********************************************************************************
// Робота з рецептами
// *********************************************************************************
// Імпорт інтерфейсів
import type { Recipe } from '@/types/recipe';

// Типізація відповіді Get-запиту від Axios - колекція рецептів - згідно структури бекенда :
interface GetRecipesHttpResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  data: Recipe[]; // Відповідь містить масив рецептів у властивості data
}

// Типізація відповіді Get-запиту від Axios - один рецепт за Id - згідно структури бекенда :
interface GetRecipeHttpResponse {
  data: Recipe; // Відповідь містить один рецепт у властивості data
}
// ==========================================================================================
// getRecipes : виконує запит для отримання колекції рецептів
// ==========================================================================================
// Структура запиту :
// ------------------------------------------------------------------------------------------
// page=2
// Page number - Номер сторінки для пагінації
// ------------------------------------------------------------------------------------------
// perPage=12
// Notes per page - Кількість на сторінці
// ------------------------------------------------------------------------------------------
// search=example_search
// Search recipe by title - Пошук по назві
// ------------------------------------------------------------------------------------------
// Filter recipes by category - Фільтрація рецептів по категории
// category=
// ------------------------------------------------------------------------------------------
// Filter recipes by ingredients - Фільтрація рецептів по інгредієнтам
// ingredients=
// ------------------------------------------------------------------------------------------
// Sort  - Сортування за ___
// sortBy=updated
// ------------------------------------------------------------------------------------------

export async function getRecipes(
  page: number = 1,
  perPage: number = 12,
  search?: string,
  category?: string,
  ingredients?: string
): Promise<GetRecipesHttpResponse> {
  // Параметри запиту
  const options = {
    params: {
      page,
      perPage,
      search,
      category,
      ingredients,
    },
  };
  // Виконуємо HTTP-запит
  const response = await nextServer.get<GetRecipesHttpResponse>('/recipes', options);

  // Повертаємо значення data відповіді
  return response.data;
  // return {
  //   page: response.page,
  //   perPage: response.perPage,
  //   totalItems: totalItems,
  //   totalPages: totalPages,
  //   data: response.data,
  // };
}

// ==========================================================================================
// getRecipeById : виконує запит для отримання рецепта за його ID.
// ==========================================================================================
// Структура запиту :

export async function getRecipeById(recipeId: string): Promise<GetRecipeHttpResponse> {
  // Виконуємо HTTP-запит
  const response = await nextServer.get<GetRecipeHttpResponse>(`/recipes/${recipeId}`);

  // Повертаємо значення data відповіді
  return response.data;
}

// ==========================================================================================
// getMyRecipes : власні рецепти користувача (приватний маршрут /api/recipes/my)
// ==========================================================================================
export async function getMyRecipes(
  page: number = 1,
  perPage: number = 12
): Promise<GetRecipesHttpResponse> {
  try {
    const response = await nextServer.get<GetRecipesHttpResponse>('/recipes/my', {
      params: { page, perPage },
    });
    return response.data;
  } catch (error) {
    // Бекенд повертає 404, якщо у користувача ще немає рецептів.
    // Трактуємо це як порожній список, а не як помилку.
    if (isAxiosError(error) && error.response?.status === 404) {
      return { page, perPage, totalItems: 0, totalPages: 0, data: [] };
    }
    throw error;
  }
}

// ==========================================================================================
// getFavoriteRecipes : улюблені рецепти користувача (приватний маршрут /api/recipes/favorites)
// ==========================================================================================
export async function getFavoriteRecipes(
  page: number = 1,
  perPage: number = 12
): Promise<GetRecipesHttpResponse> {
  try {
    const response = await nextServer.get<GetRecipesHttpResponse>('/recipes/favorites', {
      params: { page, perPage },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { page, perPage, totalItems: 0, totalPages: 0, data: [] };
    }
    throw error;
  }
}
