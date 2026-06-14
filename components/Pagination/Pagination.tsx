// ==========================================================================================
// Компонент Pagination - елемент управління пагінацією
// ==========================================================================================

// Імпорт модуля зі стилями компонента
import css from './Pagination.module.css';

// Імпорт компонента з бібліотеки пагінації react-paginate (Додатково - npm i react-paginate)
import ReactPaginate from 'react-paginate';

interface PaginationProps {
  totalPages: number;
  setPage: (selectedPage: number) => void;
  page: number;
}

export default function Pagination({
  totalPages,
  setPage,
  page,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => setPage(selected + 1)}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}
