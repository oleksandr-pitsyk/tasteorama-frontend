// ==========================================================================================
// Компонент NoteForm - форма створення нотатки
// ==========================================================================================

// Імпорт модуля зі стилями компонента
import css from './NoteForm.module.css';

import { useState } from 'react';

// Імпорт компонентів Formik, Form, Field, ErrorMessage для роботи з формами
// (Додатково - npm install formik)
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik/dist/types';

// Імпортуємо бібліотеку валідації в компонент форми
// (Додатково - npm install yup)
import * as Yup from 'yup';

// Імпорт інтерфейса для однієї нотатки
import type { Note, NoteFormValues } from '@/types/note';

// Імпорт хук useMutation
// Мутації в React Query використовуються для виконання операцій, які змінюють дані на сервері,
// таких як створення, оновлення або видалення записів.
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Імпорт бібліотеки react-hot-toast
// (Додатково - npm install react-hot-toast)
// toast - функція виклика повідомлення
// Toaster - компонент для відображення повідомлень
import toast from 'react-hot-toast';

// Iмпорт функції для HTTP-запроса - створення нотатки
import { createNote } from '@/lib/api/clientApi';

// Оголошення інтерфейса NoteFormProps, який описує типи для пропсів компонента.
interface NoteFormProps {
  // onClose - функція закриття модального вікна
  onClose: () => void;
  // currentQuery - поточний текст пошуку, який використовується для отримання нотаток з сервера.
  currentQuery: string;
  // currentTag - поточний тег фільтрації.
  currentTag: string;
}

// Створюємо змінну для початкових значень форми та заповнюємо її відповідно до інтерфейса NoteFormValues
const initialValuesForm: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

// Компонент NoteForm
export default function NoteForm({ onClose, currentQuery, currentTag }: NoteFormProps) {
  // Змінна для відстеження стану відправки форми (можна використовувати FormikState для цього)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ініціалізація змінної queryClient для роботи з кешем React Query
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------------------------
  // Створюємо схему валідації для форми за допомогою Yup :
  // Валідація поля title: рядок, мінімум 3 символи, максимум 50 символів, обов'язкове поле
  // Валідація поля content: рядок, максимум 500 символів
  // Валідація поля tag: рядок, має бути одним з перерахованих значень, обов'язкове поле
  const validationSchemaNoteForm = Yup.object({
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(50, 'Title must be at most 50 characters')
      .required('Title is required'),
    content: Yup.string().max(500, 'Content must be at most 500 characters'),
    tag: Yup.string()
      .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
      .required('Tag is required'),
  });
  // ---------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------
  // Функція обробки відправки форми, яка приймає значення форми та допоміжні функції Formik
  const handleSubmit = async (values: NoteFormValues, actions: FormikHelpers<NoteFormValues>) => {
    // Виклик мутації з додавання нотатки
    mutationCreateNote.mutate(values);
    // Скидаємо форму до початкових значень
    actions.resetForm();
  };
  // ---------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------
  // Mутація для додавання нової нотатки
  const mutationCreateNote = useMutation({
    mutationFn: async (note: NoteFormValues) => {
      // Встановлюємо стан isSubmitting в true, щоб заблокувати кнопку відправки форми під час виконання операції
      setIsSubmitting(true);
      // HTTP-request
      const noteNew = await createNote(note);
      // toast.success(`Created note: ${noteNew.title}`);
      return noteNew;
    },
    onSuccess: (noteNew: Note) => {
      // Mutation success!
      toast.success(`Create note: ${noteNew.title} success !`);
      // Встановлюємо стан isSubmitting в false, щоб розблокувати кнопку відправки форми
      setIsSubmitting(false);
      // Закриваємо модальне вікно після УСПІШНОГО створення нотатки
      onClose();
      // Коли мутація успішно виконується, інвалідовуємо всі запити з ключем "notes",
      // що змусить React Query повторно виконати ці запити і отримати оновлені дані з сервера.
      queryClient.invalidateQueries({ queryKey: ['notes', currentQuery, currentTag, 1] });
    },
    onError: (error: Error) => {
      // An error
      toast.error(`Created ERROR ${error.message}`);
      // Встановлюємо стан isSubmitting в false, щоб розблокувати кнопку відправки форми
      setIsSubmitting(false);
    },
  });
  // ---------------------------------------------------------------------------------------------

  return (
    <Formik
      initialValues={initialValuesForm}
      onSubmit={handleSubmit}
      validationSchema={validationSchemaNoteForm}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            type="text"
            name="title"
            className={css.input}
            // autoFocus={true}
          />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </button>

          <button type="submit" className={css.submitButton} disabled={isSubmitting}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
