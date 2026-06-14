// ===================================================================================
// TanStackProvider.tsx - компонент, який додає QueryClientProvider.
// -----------------------------------------------------------------------------------
// TanStackProvider - завдання якого дати доступ до queryClient усім дочірнім компонентам.
// -----------------------------------------------------------------------------------
// Детальніше:
// QueryClient – керує кешем, мутаціями, завантаженнями тощо
// QueryClientProvider – обгортка яка дає доступ до queryClient усім дочірнім компонентам
// ReactQueryDevtools - За бажанням тут також можна підключити
// -----------------------------------------------------------------------------------
// React Query Devtools – це потужний інструмент для моніторингу і налагодження запитів
// та кешування в реальному часі.
// Він дозволяє переглядати запити, їхні стани, дані, помилки та багато іншого прямо в браузері.
// -----------------------------------------------------------------------------------
// Підключаємо його глобально в app/layout.tsx, щоб забезпечити правильну роботу
// кешування та роботи з запитами через TanStack Query в усіх компонентах вашого додатка.
// ===================================================================================
'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Імпорт і налаштовання ReactQueryDevtools
// (Додатково - npm install @tanstack/react-query-devtools)
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type Props = {
  children: React.ReactNode;
};

const TanStackProvider = ({ children }: Props) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default TanStackProvider;
