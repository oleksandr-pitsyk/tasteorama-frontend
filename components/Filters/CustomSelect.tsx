'use client';

import { useState, useRef, useEffect } from 'react';
import css from './CustomSelect.module.css';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { useSearch } from '@/hooks/useSearch';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  placeholder: string;
  options: Option[];
  onChange: (value: string) => void;
  buttonClassName?: string;
  labelClassName?: string;
  wrapperClassName?: string;
}

const CustomSelect = ({
  value,
  placeholder,
  options,
  onChange,
  wrapperClassName,
  labelClassName,
  buttonClassName,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    search,
    setSearch,
    clearSearch,
    filteredItems: filteredOptions,
  } = useSearch({
    items: options,
    getLabel: option => option.label,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        clearSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSearch]);

  return (
    <div className={`${css.wrapper} ${wrapperClassName ?? ''}`} ref={wrapperRef}>
      <button
        type="button"
        className={`${css.selectButton} ${buttonClassName ?? ''}`}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className={`${css.buttonLabel} ${labelClassName ?? ''}`}>
          {selectedOption?.label || placeholder}
        </span>
        <span className={`${css.arrow} ${isOpen ? css.arrowOpen : ''}`}>
          <svg width={16} height={16}>
            <use href="/sprite.svg#down"></use>
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul className={css.dropdown}>
          <li className={css.searchItem}>
            <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
          </li>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <li
                key={option.value}
                className={`${css.option} ${option.value === value ? css.optionSelected : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  clearSearch();
                }}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className={css.emptyMessage}>Not found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
