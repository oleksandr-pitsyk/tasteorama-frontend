import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

export const api = axios.create({
  // Настройка базового URL для всіх запитів до бекенда
  baseURL: 'https://tasteorama-backend-jumn.onrender.com',
  withCredentials: true,
});
