'use client';

import { useEffect, useState } from 'react';
import css from './ScrollButton.module.css';

const ScrollButton = () => {
  const [show, setShow] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const pageIsScrollable = document.body.scrollHeight > window.innerHeight + 300;
      const atBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 50;

      setShow(pageIsScrollable && window.scrollY > 300);
      setIsAtBottom(atBottom);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        handleScroll();
      }, 100);
    });
    resizeObserver.observe(document.body);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  if (!show) return null;

  const handleClick = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <button
      className={css.btn}
      onClick={handleClick}
      aria-label={isAtBottom ? 'Scroll to top' : 'Scroll to bottom'}
    >
      {isAtBottom ? '↑' : '↓'}
    </button>
  );
};

export default ScrollButton;
