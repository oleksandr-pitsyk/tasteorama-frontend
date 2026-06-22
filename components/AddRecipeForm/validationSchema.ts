import * as Yup from 'yup';

const ingredientSchema = Yup.object({
  id: Yup.string().required('Ingredient is required'),
  measure: Yup.string().trim().required('Measure is required'),
  name: Yup.string().required('Name is required'),
});

export const addRecipeValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .max(64, 'Title must not exceed 64 characters')
    .required('Recipe title is required'),

  description: Yup.string()
    .trim()
    .max(200, 'Description must not exceed 200 characters')
    .required('Short description is required'),

  time: Yup.number()
    .typeError('Please enter the cooking time in minutes')
    .integer('Time must be a whole number')
    .min(1, 'Minimum cooking time is 1 minute')
    .max(360, 'Maximum cooking time is 360 minutes')
    .required('Cooking time is required'),
  calories: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return undefined;
      }
      return value;
    })
    .typeError('Calories must be a number')
    .integer('Calories must be a whole number')
    .min(1, 'Calories must be greater than 0')
    .max(10000, 'Calories must not exceed 10000')
    .optional(),
  category: Yup.string().trim().required('Please select a category'),
  ingredients: Yup.array()
    .of(ingredientSchema)
    .min(2, 'Please add at least two ingredients')
    .max(16, 'Ingredients must not exceed 16 items')
    .required('Ingredients list is required'),
  instructions: Yup.string()
    .trim()
    .max(1200, 'Instructions must not exceed 1200 characters')
    .required('Instructions are required'),
  thumb: Yup.mixed<File>()
    .nullable()
    .test('fileSize', 'File is too large (up to 5MB)', value => {
      if (!value) {
        return true;
      }
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only .jpg, .jpeg, .png, .webp are allowed', value => {
      if (!value) {
        return true;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      return allowedTypes.includes(value.type);
    }),
  selectedIngredientId: Yup.string().optional(),
  selectedIngredientMeasure: Yup.string().optional().max(10, 'Amount must not exceed 10 characters'),
});
