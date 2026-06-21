'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import css from './SearchBox.module.css';
console.log('SearchBox mounted');
export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState('');

  const handleSubmit = () => {
    const text = searchText.trim();

    const params = new URLSearchParams(searchParams.toString());

    if (text) {
      params.set('search', text);
    } else {
      params.delete('search');
    }

    if (text === (searchParams.get('search') ?? '')) {
      return;
    }

    setSearchText('');
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className={css.wrapper}>
      <input
        className={css.input}
        type="text"
        placeholder="Search recipes"
        value={searchText}
        onChange={event => setSearchText(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            handleSubmit();
          }
        }}
      />

      <button type="button" className={css.button} onClick={handleSubmit}>
        Search
      </button>
    </div>
  );
}
