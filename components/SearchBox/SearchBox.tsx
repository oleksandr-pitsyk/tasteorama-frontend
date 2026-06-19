// // ==========================================================================================
// // Компонент SearchBox – текстове поле для пошуку по колекції
// // ==========================================================================================

// 'use client';
// import { useState } from 'react';

// // Імпорт бібліотеки react-hot-toast (Додатково - npm install react-hot-toast)
// // toast - функція виклика повідомлення,
// // Toaster - компонент для відображення повідомлень
// // import toast from 'react-hot-toast';

// // Імпорт модуля зі стилями компонента
// import css from './SearchBox.module.css';

// // Оголошення інтерфейса SearchBoxProps, який описує типи для пропсів компонента.
// interface SearchBoxProps {
//   onChangeText: (text: string) => void;
// }

// export default function SearchBox({ onChangeText }: SearchBoxProps) {
//   const [searchText, setSearchText] = useState('');

//   // useEffect для отримання з localStorage збереженого рядка пошуку при першому рендері компонента
//   // useEffect(() => {
//   // Отримуємо з localStorage збережений рядок пошуку,
//   // а якщо його немає, то встановлюємо початкове значення як порожній рядок
//   // *************************************************************
//   // const savedSearchText = localStorage.getItem('searchText');
//   // setSearchText(savedSearchText ? JSON.parse(savedSearchText) : '');
//   // *************************************************************
//   // }, []);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     // Отримуємо текст з поля вводу та видаляємо зайві пробіли з початку та кінця
//     const text = event.target.value.trim();

//     // Перевірка значення поля
//     // if (text === '') {
//     //   // Якщо поле пусте, то виводиться повідомлення про помилку
//     //   toast.error('Please enter your search query');
//     //   // Вихід з функції
//     //   return;
//     // }

//     // Оновлення стану
//     setSearchText(text);
//     // та збереження в localStorage
//     // *************************************************************
//     // localStorage.setItem('searchText', JSON.stringify(text));
//     // *************************************************************
//     // Виклик функції onChangeText з поточним текстом пошуку
//     onChangeText(text);
//   };

//   return (
//     <input
//       className={css.input}
//       type="text"
//       onChange={handleChange}
//       value={searchText}
//       placeholder="Search notes"
//     />
//   );
// }

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
