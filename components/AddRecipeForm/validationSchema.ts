import * as Yup from 'yup';

const ingredientSchema = Yup.object({
  id: Yup.string().required('Ingredient is required'),
  measure: Yup.string().trim().required('Measure is required'),
  name: Yup.string().required('Name is required'),
});

export const addRecipeValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(2, 'Title must contain at least 2 characters')
    .max(100, 'Title must not exceed 100 characters')
    .required('Recipe title is required'),

  description: Yup.string()
    .trim()
    .min(10, 'Description must contain at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .required('Short description is required'),

  time: Yup.number()
    .typeError('Please enter the cooking time in minutes')
    .integer('Time must be a whole number')
    .min(1, 'Minimum cooking time is 1 minute')
    .max(1440, 'Maximum cooking time is 1440 minutes')
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
    .optional(),
  category: Yup.string().trim().required('Please select a category'),
  ingredients: Yup.array()
    .of(ingredientSchema)
    .min(1, 'Please add at least one ingredient')
    .required('Ingredients list is required'),
  instructions: Yup.string()
    .trim()
    .min(10, 'Instructions must contain at least 10 characters')
    .max(3000, 'Instructions must not exceed 3000 characters')
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
  selectedIngredientMeasure: Yup.string().optional(),
});
