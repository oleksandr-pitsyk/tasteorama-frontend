// =========================================================================
// Створення глобального стану нотаток
// =========================================================================
// Імпорт функції create (для створення глобального стану) з бібліотеки zustand
import { create } from 'zustand';

// Імпортуємо функцію для зберігання глобального стану в LocalStorage
import { persist } from 'zustand/middleware';

// Імпорт інтерфейса нотатки для додавання в формі
import type { NoteFormValues } from '@/types/note';

const initialDraft: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

type NoteDraftStore = {
  // об’єкт, що містить тимчасові дані форми нотатки
  draft: NoteFormValues;
  // функція для оновлення полів чернетки.
  setDraft: (note: NoteFormValues) => void;
  // функція для очищення чернетки до початкового стану.
  clearDraft: () => void;
};

// Обгортаємо функцію створення стора функцією persist
export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note =>
        set(() => ({
          draft: note,
        })),
      clearDraft: () =>
        set(() => ({
          draft: initialDraft,
        })),
    }),
    {
      // Ключ у localStorage
      name: 'note-draft',
      // Зберігаємо у localStorage лише властивість draft
      partialize: state => ({ draft: state.draft }),
    }
  )
);
