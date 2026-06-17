'use client';

import { useState, useRef, useEffect } from 'react';
import css from './CustomSelect.module.css';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  placeholder: string;
  options: Option[];
  onChange: (value: string) => void;
}

const CustomSelect = ({
  value,
  placeholder,
  options,
  onChange,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={css.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={css.selectButton}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className={css.buttonLabel}>
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
          {options.map(option => (
            <li
              key={option.value}
              className={`${css.option} ${
                option.value === value ? css.optionSelected : ''
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;