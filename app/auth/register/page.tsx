// ==================================================================================
//  /auth/register – для створення нового акаунта (реєстрація)
// ==================================================================================
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// // Імпорт функції реєстрації  з клієнтського API
// import { register, NewUser } from '@/lib/api/clientApi';

// // Імпорт глобального стану аутентифікації користувача
// import { useAuthStore } from '@/lib/store/authStore';

// import { ApiError } from '@/app/api/api';

// // Імпорт стилів з модуля стилів
// import css from './SignUpPage.module.css';

'use client';

// Додаємо імпорти
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register, RegisterRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { ApiError } from '@/app/api/api';

const RegisterPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  // Отримуємо метод із стора
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      // Типізуємо дані форми
      const formValues = Object.fromEntries(formData) as RegisterRequest;
      // Виконуємо запит
      const res = await register(formValues);
      // Виконуємо редірект або відображаємо помилку
      if (res) {
        // Записуємо користувача у глобальний стан
        setUser(res);
        router.push('/profile/own');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Oops... some error'
      );
    }
  };

  return (
    <>
      <h1>Sign up</h1>
      <form action={handleSubmit}>
        <label>
          Username
          <input type="text" name="name" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </>
  );
};

export default RegisterPage;
