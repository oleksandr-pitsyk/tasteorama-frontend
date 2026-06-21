import css from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder,
}: SearchInputProps) => {
  return (
    <div className={css.searchItemWrapper}>
      <svg className={css.searchIcon} width={16} height={16}>
        <use href="/sprite.svg#search" />
      </svg>

      <input
        className={css.searchFilter}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};