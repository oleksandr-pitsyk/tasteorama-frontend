// API для роботи з нотатками
// ==========================================================================================
// Функції для виконання HTTP-запитів
// ==========================================================================================

// lib/api/api.ts — для створення одного спільного екземпляра axios,
// з налаштуванням withCredentials: true для підтримки cookies;
// ==========================================================================================

// Імпорт бібліотеки axios
import axios from 'axios';

// Базова URL-адреса для всіх запитів, що надсилаються через цей інстанс
// axios.defaults.baseURL = 'https://tasteorama-backend-jumn.onrender.com';
axios.defaults.baseURL = 'http://localhost:3000/api';

// *********************************************************************************
// Робота з категоріями
// *********************************************************************************
// Імпорт інтерфейсів
import type { Category } from '@/types/category';

// Типізація відповіді Get-запиту від Axios - згідно структури бекенда :
interface GetCategoriesHttpResponse {
  data: Category[]; // Відповідь містить масив категорій у властивості data
}
// ==========================================================================================
// getCategories : виконує запит для отримання колекції категорій із сервера.
// ==========================================================================================
// Структура запиту :

export async function getCategories(): Promise<GetCategoriesHttpResponse> {
  // Виконуємо HTTP-запит
  const response = await axios.get<GetCategoriesHttpResponse>('/categories');
  console.log('Fetch - GET :');
  console.log('response.data', response.data);
  // console.log('totalPages', response.data.totalPages);

  // Повертаємо значення notes та totalPages відповіді
  return response.data;
}

// *********************************************************************************
// Робота з інгредієнтами
// *********************************************************************************
// Імпорт інтерфейсів
import type { Ingredient } from '@/types/ingredient';

// Типізація відповіді Get-запиту від Axios - згідно структури бекенда :
interface GetIngredientsHttpResponse {
  data: Ingredient[]; // Відповідь містить масив категорій у властивості data
}
// ==========================================================================================
// getIngredients : виконує запит для отримання колекції інгредієнтів із сервера.
// ==========================================================================================
// Структура запиту :

export async function getIngredients(): Promise<GetIngredientsHttpResponse> {
  // Виконуємо HTTP-запит
  const response = await axios.get<GetIngredientsHttpResponse>('/ingredients');
  console.log('Fetch - GET :');
  console.log('response.data', response.data);

  // Повертаємо значення data відповіді
  return response.data;
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
  const response = await axios.get<GetRecipesHttpResponse>('/recipes', options);

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
  const response = await axios.get<GetRecipeHttpResponse>(`/recipes/${recipeId}`);

  // Повертаємо значення data відповіді
  return response.data;
}
