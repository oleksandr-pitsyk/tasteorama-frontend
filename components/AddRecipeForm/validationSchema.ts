import * as Yup from 'yup';

const ingredientSchema = Yup.object({
  id: Yup.string().required('Інгредієнт обов’язковий'),
  measure: Yup.string().trim().required('Кількість обов’язкова'),
  name: Yup.string().required(),
});

export const addRecipeValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(2, 'Назва має містити щонайменше 2 символи')
    .max(100, 'Назва має містити не більше 100 символів')
    .required('Назва рецепту обов’язкова'),
  description: Yup.string()
    .trim()
    .min(10, 'Опис має містити щонайменше 10 символів')
    .max(500, 'Опис має містити не більше 500 символів')
    .required('Короткий опис обов’язковий'),
  time: Yup.number()
    .typeError('Вкажіть час приготування у хвилинах')
    .integer('Час має бути цілим числом')
    .min(1, 'Мінімальний час приготування - 1 хв')
    .max(1440, 'Максимальний час приготування - 1440 хв')
    .required('Час приготування обов’язковий'),
  calories: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return undefined;
      }
      return value;
    })
    .typeError('Калорії мають бути числом')
    .integer('Калорії мають бути цілим числом')
    .min(1, 'Калорії мають бути більше 0')
    .optional(),
  category: Yup.string().trim().required('Оберіть категорію'),
  ingredients: Yup.array()
    .of(ingredientSchema)
    .min(1, 'Додайте щонайменше один інгредієнт')
    .required('Список інгредієнтів обов’язковий'),
  instructions: Yup.string()
    .trim()
    .min(10, 'Інструкція має містити щонайменше 10 символів')
    .max(3000, 'Інструкція має містити не більше 3000 символів')
    .required('Інструкція обов’язкова'),
  thumb: Yup.mixed<File>()
    .nullable()
    .test('fileSize', 'Файл занадто великий (до 5MB)', value => {
      if (!value) {
        return true;
      }
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Дозволені тільки .jpg, .jpeg, .png, .webp', value => {
      if (!value) {
        return true;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      return allowedTypes.includes(value.type);
    }),
  selectedIngredientId: Yup.string().optional(),
  selectedIngredientMeasure: Yup.string().optional(),
});
