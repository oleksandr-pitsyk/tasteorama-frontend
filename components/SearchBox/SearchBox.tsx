// ==========================================================================================
// Компонент SearchBox – текстове поле для пошуку по колекції
// ==========================================================================================

'use client';
import { useState } from 'react';

// Імпорт бібліотеки react-hot-toast (Додатково - npm install react-hot-toast)
// toast - функція виклика повідомлення,
// Toaster - компонент для відображення повідомлень
// import toast from 'react-hot-toast';

// Імпорт модуля зі стилями компонента
import css from './SearchBox.module.css';

// Оголошення інтерфейса SearchBoxProps, який описує типи для пропсів компонента.
interface SearchBoxProps {
  onChangeText: (text: string) => void;
}

export default function SearchBox({ onChangeText }: SearchBoxProps) {
  const [searchText, setSearchText] = useState('');

  // useEffect для отримання з localStorage збереженого рядка пошуку при першому рендері компонента
  // useEffect(() => {
  // Отримуємо з localStorage збережений рядок пошуку,
  // а якщо його немає, то встановлюємо початкове значення як порожній рядок
  // *************************************************************
  // const savedSearchText = localStorage.getItem('searchText');
  // setSearchText(savedSearchText ? JSON.parse(savedSearchText) : '');
  // *************************************************************
  // }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Отримуємо текст з поля вводу та видаляємо зайві пробіли з початку та кінця
    const text = event.target.value.trim();

    // Перевірка значення поля
    // if (text === '') {
    //   // Якщо поле пусте, то виводиться повідомлення про помилку
    //   toast.error('Please enter your search query');
    //   // Вихід з функції
    //   return;
    // }

    // Оновлення стану
    setSearchText(text);
    // та збереження в localStorage
    // *************************************************************
    // localStorage.setItem('searchText', JSON.stringify(text));
    // *************************************************************
    // Виклик функції onChangeText з поточним текстом пошуку
    onChangeText(text);
  };

  return (
    <input
      className={css.input}
      type="text"
      onChange={handleChange}
      value={searchText}
      placeholder="Search notes"
    />
  );
}
