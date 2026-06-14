// Імпорт компонента Link з Next.js - Для створення посилань
import Link from 'next/link';

// Імпорт стилів з модуля стилів
import css from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© 2026 CookingCompanion. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
