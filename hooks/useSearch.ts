import { useMemo, useState } from 'react';

interface UseSearchProps<T> {
  items: T[];
  getLabel: (item: T) => string;
}

export const useSearch = <T,>({
  items,
  getLabel,
}: UseSearchProps<T>) => {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return items.filter(item =>
      getLabel(item)
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [items, getLabel, search]);

  const clearSearch = () => {
    setSearch('');
  };

  return {
    search,
    setSearch,
    clearSearch,
    filteredItems,
  };
};