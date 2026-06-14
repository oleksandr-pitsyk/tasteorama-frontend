import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

export const api = axios.create({
  baseURL: 'https://tasteorama-backend-jumn.onrender.com',
  withCredentials: true,
});
