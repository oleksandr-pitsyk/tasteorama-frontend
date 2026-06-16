// Цей файл відповідає за налаштування базового API-клієнта для всіх запитів до бекенда.
// Він використовує бібліотеку axios для створення екземпляра API з певними налаштуваннями,
// такими як базовий URL та підтримка куків.
// Тип ApiError визначає структуру помилки, яка може виникнути при виконанні запиту.
// ===========================================================================================

import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

export const api = axios.create({
  // Настройка базового URL для всіх запитів до бекенда
  baseURL: 'https://tasteorama-backend-jumn.onrender.com',
  withCredentials: true, // дозволяє axios працювати з cookie
});
