'use client';

import css from './ModalLogout.module.css';
import Modal from '@/components/Modal/Modal';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { useState } from 'react';

export default function LogoutModal() {
  const router = useRouter();
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);
  // Локальний стан - для рендерингу модального вікна (default=true)
  const [isModal, setIsModal] = useState<boolean>(true);

  // Підтвердження виходу
  const handleConfirm = async () => {
    // Стан рендерингу модального вікна - відключено
    setIsModal(false);
    // Виклик функції виходу з аккаунту в БД
    await logout();
    // Очищення глобального стану авторризації
    clearIsAuthenticated();
    // Перехід на основну сторінку
    router.push('/');
  };

  // Відміна виходу (logout)
  const handleClose = () => {
    // Стан рендерингу модального вікна - відключено
    setIsModal(false);
    // Повернення на попередню сторінку
    router.back();
  };

  return (
    <div>
      {isModal && (
        <Modal onClose={handleClose}>
          <h2 className={css.title}>Are you sure?</h2>
          <p className={css.text}>We will miss you!</p>
          <div className={css.buttonContainer}>
            <button className={css.cancelBtn} onClick={handleClose}>
              Cancel
            </button>
            <button className={css.logoutBtn} onClick={handleConfirm}>
              Log out
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// <Modal onClose={handleClose}>
// <h2 className={css.title}>Are you sure?</h2>
// <p className={css.text}>We will miss you!</p>
// <div className={css.buttonContainer}>
//   <button className={css.cancelBtn} onClick={handleClose}>
//     Cancel
//   </button>
//   <button className={css.logoutBtn} onClick={handleConfirm}>
//     Log out
//   </button>
// </div>
// </Modal>
