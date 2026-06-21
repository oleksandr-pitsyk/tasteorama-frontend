'use client';

import css from './LoadMoreBtn.module.css';

interface LoadMoreBtnProps {
  onClick: () => void;
  isLoading: boolean;
}

const LoadMoreBtn = ({ onClick, isLoading }: LoadMoreBtnProps) => {
  return (
    <div className={css.wrapper}>
      <button className={css.button} onClick={onClick} disabled={isLoading} type="button">
        {isLoading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
};

export default LoadMoreBtn;
