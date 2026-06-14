// ==========================================================================================
// Компонент NoteList - колекція нотаток
// ==========================================================================================

// Імпорт модуля зі стилями компонента
import css from './NoteList.module.css';

// Імпорт інтерфейса для однієї нотатки
import { type Note } from '@/types/note';

// Імпорт бібліотеки React Query для роботи з мутаціями та кешуванням даних
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Імпорт компонента Link з Next.js - Для створення посилань
import Link from 'next/link';

// Імпорт бібліотеки react-hot-toast (Додатково - npm install react-hot-toast)
// toast - функція виклика повідомлення
// Toaster - компонент для відображення повідомлень
import toast from 'react-hot-toast';

// Iмпорт функції для HTTP-запроса - видалення нотатки
import { deleteNote } from '@/lib/api/clientApi';

// Оголошення інтерфейса NoteListProps, який описує типи для пропсів компонента.
interface NoteListProps {
  // notes - масив нотаток, який буде відображатися в компоненті NoteList.
  // Кожна нотатка має тип Note, який описує структуру даних для однієї нотатки.
  notes: Note[];
  // currentQuery - поточний текст пошуку, який використовується для отримання нотаток з сервера.
  // currentQuery: string;
  // currentTag - поточний тег фільтрації.
  // currentTag: string;
}

export default function NoteList({ notes }: NoteListProps) {
  // Ініціалізація змінної queryClient для роботи з кешем React Query
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------------------------
  // const mutation = useMutation(options)
  // Хук useMutation приймає об’єкт налаштувань
  //   mutationFn – асинхронна функція, яка виконує запит для зміни даних на сервері,
  //                тобто POST, DELETE, PUT або PATCH.
  //   onSuccess  – викликається, коли мутація успішна. Це дозволяє вам виконати додаткові дії
  //                після того, як сервер успішно обробить запит.
  //   onError    – викликається, коли мутація завершується помилкою. Це дозволяє вам
  //                обробити помилки, наприклад, відобразити повідомлення про помилку.
  // Хук useMutation не викликає асинхронну функцію,
  // а повертає об’єкт мутації із наступними властивостями:
  //      mutate    – метод, який викликається для запуску асинхронної функції.
  //      isPending – статус, який показує, що мутація зараз виконується
  //                  (наприклад, дані відправляються на сервер).
  //      isError   – встановлюється в true, якщо сталася помилка при виконанні мутації.
  //      isSuccess – встановлюється в true, якщо мутація була успішною, і дані були оновлені на сервері.
  // Ці стани допомагають вам відстежувати, на якому етапі виконання знаходиться мутація
  // ---------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------
  // Mутація для видалення нотатки
  const mutationDeleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      // HTTP-request
      const noteDelete = await deleteNote(noteId);
      // toast.success(`Deleted note: ${noteDelete.title}`);
      return noteDelete;
    },
    onSuccess: (noteDelete: Note) => {
      // Mutation success!
      toast.success(`Delete note: ${noteDelete.title} success !`);
      // Коли мутація успішно виконується, інвалідовуємо всі запити з ключем "notes",
      // що змусить React Query повторно виконати ці запити і отримати оновлені дані з сервера.
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: error => {
      // An error
      toast.error(`Deleted ERROR ${error.message}`);
    },
  });
  // ---------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------
  // Функція видалення нотатки
  const taskDelete = (noteId: string) => {
    // console.log('taskDelete - noteId', noteId);
    // Виклик мутації з видалення вибраної нотатки
    mutationDeleteNote.mutate(noteId);
  };
  // ---------------------------------------------------------------------------------------------

  return (
    <ul className={css.list}>
      {/* Набір елементів списку нотаток */}
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`} className={css.button}>
              View details
            </Link>
            <button className={css.button} onClick={() => taskDelete(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
