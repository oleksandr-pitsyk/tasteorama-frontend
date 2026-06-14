// ==========================================================================================
// Компонент NoteForm - форма створення нотатки
// ==========================================================================================

'use client';

// Імпорт модуля зі стилями компонента
import css from './NoteForm.module.css';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

// Імпорт компонентів Formik, Form, Field, ErrorMessage для роботи з формами
// (Додатково - npm install formik)
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import type { FormikHelpers } from 'formik/dist/types';

// Імпортуємо бібліотеку валідації в компонент форми
// (Додатково - npm install yup)
// import * as Yup from 'yup';

// Імпорт інтерфейса для однієї нотатки
import type { Note, NoteFormValues, NoteTag } from '@/types/note';

// Імпорт хук useMutation
// Мутації в React Query використовуються для виконання операцій, які змінюють дані на сервері,
// таких як створення, оновлення або видалення записів.
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

// Імпорт бібліотеки react-hot-toast
// (Додатково - npm install react-hot-toast)
// toast - функція виклика повідомлення
// Toaster - компонент для відображення повідомлень
import toast from 'react-hot-toast';

// Iмпорт функції для HTTP-запроса - створення нотатки
import { createNote } from '@/lib/api/clientApi';

// Імпорт хука чернетки нотатки
import { useNoteDraftStore } from '@/lib/store/noteStore';

// Оголошення інтерфейса NoteFormProps, який описує типи для пропсів компонента.
// interface NoteFormProps {
// onClose - функція закриття модального вікна
// onClose: () => void;
// currentQuery - поточний текст пошуку, який використовується для отримання нотаток з сервера.
// currentQuery: string;
// currentTag - поточний тег фільтрації.
// currentTag: string;
// }

// -------------------------------------------------------------------------------------------
// Створюємо схему валідації для форми за допомогою Yup :
// Валідація поля title: рядок, мінімум 3 символи, максимум 50 символів, обов'язкове поле
// Валідація поля content: рядок, максимум 500 символів
// Валідація поля tag: рядок, має бути одним з перерахованих значень, обов'язкове поле
// const validationSchemaNoteForm = Yup.object({
//   title: Yup.string()
//     .min(3, 'Title must be at least 3 characters')
//     .max(50, 'Title must be at most 50 characters')
//     .required('Title is required'),
//   content: Yup.string().max(500, 'Content must be at most 500 characters'),
//   tag: Yup.string()
//     .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
//     .required('Tag is required'),
// });
// ---------------------------------------------------------------------------------------------

// Компонент NoteForm
export default function NoteForm() {
  const router = useRouter();

  // Змінна для відстеження стану відправки форми
  // (використовується для блокування кнопки відправки під час виконання операції)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ініціалізація змінної queryClient для роботи з кешем React Query
  const queryClient = useQueryClient();

  // Викликаємо хук чернетки нотатки і отримуємо значення
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  // -------------------------------------------------------------------------------------------
  // Оголошуємо функцію для onChange щоб при зміні будь-якого
  // елемента форми оновити чернетку нотатки в сторі
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    // Отримуємо name та value з елемента, який викликав подію зміни
    const { name, value } = event.target;
    // Коли користувач змінює будь-яке поле форми — оновлюємо стан
    setDraft({ ...draft, [name]: value });
  };
  // -------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------
  // Mутація для додавання нової нотатки
  const mutationCreateNote = useMutation({
    mutationFn: async (note: NoteFormValues) => {
      // Встановлюємо стан isSubmitting в true, щоб заблокувати кнопку відправки форми під час виконання операції
      setIsSubmitting(true);
      // HTTP-request
      const noteNew = await createNote(note);
      // Повертаємо нову нотатку, яка була створена на сервері, щоб вона була доступна в onSuccess для відображення повідомлення та оновлення даних
      return noteNew;
    },
    onSuccess: (noteNew: Note) => {
      // Mutation success!
      toast.success(`Create note: ${noteNew.title} success !`);
      // Встановлюємо стан isSubmitting в false, щоб розблокувати кнопку відправки форми
      setIsSubmitting(false);
      // При успішному створенні нотатки очищуємо чернетку
      clearDraft();
      // Закриваємо вікно після УСПІШНОГО створення нотатки
      closeForm();
      // Коли мутація успішно виконується, інвалідовуємо всі запити з ключем "notes",
      // що змусить React Query повторно виконати ці запити і отримати оновлені дані з сервера.
      // queryClient.invalidateQueries({ queryKey: ['notes', currentQuery, currentTag, 1] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error: Error) => {
      // An error
      toast.error(`Created ERROR ${error.message}`);
      // Встановлюємо стан isSubmitting в false, щоб розблокувати кнопку відправки форми
      setIsSubmitting(false);
    },
  });
  // -------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------
  // Функція для закриття форми, яка викликається
  // при натисканні кнопки "Cancel" або після успішного створення нотатки
  const closeForm = () => {
    // Перехід на попередню сторінку, щоб закрити форму
    router.back();
    // або можна використовувати router.push для переходу на конкретну сторінку, наприклад:
    // Перехід по повному URL з параметрами, щоб оновити сторінку без прокрутки вгору
    // router.push('/notes/filter/all', { scroll: false });
  };
  // -------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------
  // Функція обробки відправки форми, яка приймає значення форми
  const handleSubmit = (formData: FormData) => {
    // Конвертуємо FormData в об’єкт NoteFormValues
    const values: NoteFormValues = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as NoteTag,
    };

    // const validationResult = validationSchemaNoteForm.validate(values, { abortEarly: false });
    // console.log('validationResult', validationResult);

    // Виклик мутації з додавання нотатки
    mutationCreateNote.mutate(values);
  };
  //--------------------------------------------------------------------------------------------

  // До кожного елемента додаємо defaultValue та onChange щоб задати початкове значення
  // із чернетки та при зміні оновити чернетку в сторі
  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          defaultValue={draft?.title}
          onChange={handleChange}
          className={css.input}
          autoFocus
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          defaultValue={draft?.content}
          onChange={handleChange}
          rows={8}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          defaultValue={draft?.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => {
            closeForm();
          }}
        >
          Cancel
        </button>

        <button type="submit" className={css.submitButton} disabled={isSubmitting}>
          Create note
        </button>
      </div>
    </form>
  );
}
