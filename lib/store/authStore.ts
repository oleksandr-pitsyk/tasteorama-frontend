// =========================================================================
// Створення глобального стану аутентифікації користувача
// =========================================================================
// Імпорт функції create (для створення глобального стану) з бібліотеки zustand
import { create } from 'zustand';

// Імпортуємо функцію для зберігання глобального стану в LocalStorage
// import { persist } from 'zustand/middleware';

// Імпорт інтерфейса користувача
import { User } from '@/types/user';

// Типізація глобального стану аутентифікації
type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  isOpenRegisterLoginForm: boolean;
  setIsOpenRegisterLoginForm: (open: boolean) => void;
  // clearIsOpenRegisterLoginForm: () => void;
};

export const useAuthStore = create<AuthStore>()(set => ({
  isAuthenticated: false,
  user: null,
  setUser: (user: User) => {
    set(() => ({ user, isAuthenticated: true }));
  },
  clearIsAuthenticated: () => {
    set(() => ({ user: null, isAuthenticated: false }));
  },
  isOpenRegisterLoginForm: false,
  setIsOpenRegisterLoginForm: (open: boolean) => {
    set(() => ({ isOpenRegisterLoginForm: open }));
  },
  // clearIsOpenRegisterLoginForm: () => {
  //   set(() => ({ isOpenRegisterLoginForm: false }));
  // },
}));

// Обгортаємо функцію створення стора функцією persist
// export const useAuthStore = create<AuthStore>(persist((set) => ({
//   isAuthenticated: false,
//   user: null,
//   setUser: (user: User) => {
//     set(() => ({ user, isAuthenticated: true }));
//   },
//   clearIsAuthenticated: () => {
//     set(() => ({ user: null, isAuthenticated: false }));
//   },
// }), {
//     // Ключ у localStorage
//     name: 'auth-store',
//     // Зберігаємо у localStorage лише властивості isAuthenticated та user
//     partialize: state => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
//   }
// ));
