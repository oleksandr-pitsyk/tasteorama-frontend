// // ==================================================================================
// // /auth/login – для входу в існуючий акаунт (логін)
// // ==================================================================================

// // import { useState } from 'react';
// // import { useRouter } from 'next/navigation';

// // // Імпорт функції реєстрації  з клієнтського API
// // import { login } from '@/lib/api/clientApi';

// // // Імпорт глобального стану аутентифікації користувача
// // import { useAuthStore } from '@/lib/store/authStore';

// // import { ApiError } from '@/app/api/api';

// // Імпорт стилів з модуля стилів
// // import css from './SignInPage.module.css';

// 'use client';

// // Додаємо імпорти
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { login, LoginRequest } from '@/lib/api/clientApi';
// import { useAuthStore } from '@/lib/store/authStore';
// import { ApiError } from '@/app/api/api';

// const LoginPage = () => {
//   const router = useRouter();
//   const [error, setError] = useState('');
//   // Отримуємо метод із стора
//   const setUser = useAuthStore(state => state.setUser);

//   const handleSubmit = async (formData: FormData) => {
//     try {
//       // Типізуємо дані форми
//       const formValues = Object.fromEntries(formData) as LoginRequest;
//       // Виконуємо запит
//       const res = await login(formValues);
//       // Виконуємо редірект або відображаємо помилку
//       if (res) {
//         // Записуємо користувача у глобальний стан
//         setUser(res);
//         router.push('/profile/own');
//       } else {
//         setError('Invalid email or password');
//       }
//     } catch (error) {
//       setError(
//         (error as ApiError).response?.data?.error ??
//           (error as ApiError).message ??
//           'Oops... some error'
//       );
//     }
//   };

//   return (
//     <form action={handleSubmit}>
//       <h1>Sign in</h1>
//       <label>
//         Email
//         <input type="email" name="email" required />
//       </label>
//       <label>
//         Password
//         <input type="password" name="password" required />
//       </label>
//       <button type="submit">Log in</button>
//       {error && <p>{error}</p>}
//     </form>
//   );
// };

// export default LoginPage;

import LoginForm from '@/components/LoginForm/LoginForm';

export default function LoginPage() {
  return (<LoginForm />);
}