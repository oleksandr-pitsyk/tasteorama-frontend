// ==========================================================================================
// Компонент Modal - універсальний компонент модального вікна,
//                   який може відображати будь-який вміст, переданий через children
// ==========================================================================================

// Компонент Modal використовується в компоненті App
// Modal отримує два пропси:
//      - incluse - назва компонента, який буде в модальному вікні
//      - onClose - функцію закриття модального вікна.
// ------------------------------------------------------------------------------------------

// Функція createPortal дозволяє рендерити компонент в інше місце DOM-дерева,
// зазвичай безпосередньо в <body>, іноді в інший блок в корні за id
import { createPortal } from 'react-dom';

import { useEffect } from 'react';

// Імпорт інтерфейса для одного фільму
// import type { Note } from '@/types/note';

// Імпорт модуля зі стилями компонента
import css from './Modal.module.css';

// Оголошення інтерфейса ModalProps, який описує типи для пропсів компонента.
interface ModalProps {
  // Будь який контент між відкриваючим та закриваючим тегом компонента буде передано як children -
  // спеціальний службовий пропс, що дозволяє передавати дочірні елементи
  // (компоненти або JSX) в компонент.
  // Для типізації пропса children використовуємо стандартний тип React.ReactNode,
  // який описує будь-який вміст, що може бути переданий в компонент:
  // елементи, рядки, числа, масиви елементів або навіть інші компоненти.
  children: React.ReactNode;
  // onClose - функція закриття модального вікна
  // Типізація функцій - стандартна (через стрілочну функцію)
  onClose: () => void;
}

// Компонент Modal
export default function Modal({ children, onClose }: ModalProps) {
  // Функція закриття модального вікна по кліку на Backdrop
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Еффект для перевірки натискання клавіші Esc
  useEffect(() => {
    // Обробник події - натискання клавіатури
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    // Додаємо слухач клавіатури на весь документ
    document.addEventListener('keydown', handleKeyDown);
    // Додаємо у useEffect код блокуання скролу при відкритті модалки
    document.body.style.overflow = 'hidden';

    //  При розмонтуванні компонента додаємо наступне :
    return () => {
      // Видалення слухача клавіатури
      document.removeEventListener('keydown', handleKeyDown);
      // Видаляємо з useEffect код блокування скролу
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Створення розмітки компонента в кінці елемента document.body
  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={css.modal}>
        {/* Вміст модального вікна*/}
        {/* Тут рендериться переданий вміст із пропса children */}
        {children}
        {/* ================================================== */}
      </div>
    </div>,
    document.body
  );
}
