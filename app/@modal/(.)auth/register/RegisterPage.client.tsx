// ==========================================================================================
// /notes/[id] – сторінка деталей однієї нотатки (динамічний маршрут).
// ------------------------------------------------------------------------------------------
// Клієнський компонент, який відповідає за відображення деталей однієї нотатки за її id.
// ------------------------------------------------------------------------------------------
// На цій сторінці відображається повна інформація про одну нотатку за її id.
// ==========================================================================================

'use client';

// Імпорт модуля зі стилями компонента
import css from './RegisterPage.module.css';

import { useRouter } from 'next/navigation';

import Modal from '@/components/Modal/Modal';

const RegisterPageClient = () => {
  // Запуск роутера
  const router = useRouter();

  // Зачинення вікна - повернення на попередній маршрут URL
  const closeModal = () => router.back();

  return (
    <Modal onClose={closeModal}>
      <h2>Register Page</h2>
      <button onClick={closeModal} className={css.backBtn}>
        Close
      </button>
    </Modal>
  );
};

export default RegisterPageClient;
