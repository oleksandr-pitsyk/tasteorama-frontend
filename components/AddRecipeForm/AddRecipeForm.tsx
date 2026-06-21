'use client';

import { useEffect, useMemo, useState } from 'react';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import css from './AddRecipeForm.module.css';
import { createRecipe, getCategories, getIngredients } from './api';
import { initialValues } from './constants';
import { buildNextIngredients, getVisibleIngredients } from './helpers';
import type { AddRecipeFormValues } from './types';
import { addRecipeValidationSchema } from './validationSchema';

const AddRecipeForm = () => {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const {
    data: ingredientsData,
    isLoading: ingredientsLoading,
    isError: isIngredientsError,
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  });

  const categories = useMemo(() => categoriesData?.data ?? [], [categoriesData]);
  const ingredients = useMemo(() => ingredientsData?.data ?? [], [ingredientsData]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (isCategoriesError) {
      toast.error('Failed to load categories');
    }
  }, [isCategoriesError]);

  useEffect(() => {
    if (isIngredientsError) {
      toast.error('Failed to load ingredients');
    }
  }, [isIngredientsError]);

  const handleSubmit = async (
    values: AddRecipeFormValues,
    actions: FormikHelpers<AddRecipeFormValues>
  ) => {
    try {
      await createRecipe(values);

      actions.resetForm();
      setPreviewUrl(null);
      router.push(`/`);
      // router.push(`/recipes/${recipeId}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const isDataLoading = categoriesLoading || ingredientsLoading;

  return (
    <>
      <Toaster position="top-right" />

      <Formik
        initialValues={initialValues}
        validationSchema={addRecipeValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const visibleIngredients = getVisibleIngredients(values.ingredients);

          return (
            <Form className={css.form}>
              <div className={css.formGrid}>
                <section className={css.uploadSection}>
                  <h2 className={css.photoTitle}>Upload Photo</h2>
                  <label className={css.uploadBox} htmlFor="thumb">
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewUrl} alt="Recipe preview" className={css.uploadImage} />
                    ) : (
                      <svg width="64" height="64" className={css.cameraIcon}>
                        <use xlinkHref="/sprite.svg#media"></use>
                      </svg>
                    )}
                  </label>

                  {/* КАРТИНКА */}
                  <input
                    id="thumb"
                    name="thumb"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className={css.hiddenInput}
                    onChange={event => {
                      const file = event.currentTarget.files?.[0] ?? null;
                      setFieldValue('thumb', file);

                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                      }

                      if (file) {
                        setPreviewUrl(URL.createObjectURL(file));
                      } else {
                        setPreviewUrl(null);
                      }
                    }}
                  />
                  <ErrorMessage name="thumb" component="span" className={css.error} />
                </section>

                {/* ІНГРЕДІЄНТИ */}
                <section className={css.ingredientsSection}>
                  <h2 className={css.ingredientsTitle}>Ingredients</h2>

                  <div className={css.ingredientsControls}>
                    <div>
                      <label className={css.label} htmlFor="selectedIngredientId">
                        Name
                      </label>
                      <Field
                        as="select"
                        id="selectedIngredientId"
                        name="selectedIngredientId"
                        className={`${css.input} ${css.selectInput} ${
                          !values.selectedIngredientId ? css.selectPlaceholder : ''
                        }`}
                        disabled={ingredientsLoading}
                      >
                        <option value="" disabled hidden>
                          Broccoli
                        </option>
                        {ingredients.map(ingredient => (
                          <option key={ingredient._id} value={ingredient._id}>
                            {ingredient.name}
                          </option>
                        ))}
                      </Field>
                    </div>

                    <div>
                      <label className={css.label} htmlFor="selectedIngredientMeasure">
                        Amount
                      </label>
                      <Field
                        id="selectedIngredientMeasure"
                        name="selectedIngredientMeasure"
                        type="text"
                        className={css.input}
                        placeholder="100g"
                      />
                    </div>

                    <button
                      type="button"
                      className={css.addIngredientButton}
                      onClick={() => {
                        try {
                          const nextIngredients = buildNextIngredients({
                            currentIngredients: values.ingredients,
                            selectedIngredientId: values.selectedIngredientId,
                            selectedIngredientMeasure: values.selectedIngredientMeasure,
                            availableIngredients: ingredients,
                          });

                          setFieldValue('ingredients', nextIngredients);
                          setFieldValue('selectedIngredientId', '');
                          setFieldValue('selectedIngredientMeasure', '');
                        } catch (error) {
                          toast.error((error as Error).message);
                        }
                      }}
                    >
                      Add new Ingredient
                    </button>
                  </div>

                  <ErrorMessage
                    name="ingredients"
                    component="span"
                    className={`${css.error} ${css.ingredientsError}`}
                  />

                  <div className={css.ingredientsHead}>
                    <span className={css.ingredientsHeadText}>Name:</span>
                    <span className={css.ingredientsHeadText}>Amount:</span>
                    <span aria-hidden="true" />
                  </div>

                  {visibleIngredients.length > 0 && (
                    <ul className={css.ingredientsList}>
                      {visibleIngredients.map(item => (
                        <li key={item.id} className={css.ingredientRow}>
                          <span className={css.ingredientText}>{item.name}</span>
                          <span className={css.ingredientText}>{item.measure}</span>
                          <button
                            type="button"
                            className={css.removeButton}
                            aria-label="Delete ingredient"
                            onClick={() => {
                              setFieldValue(
                                'ingredients',
                                values.ingredients.filter(ingredient => ingredient.id !== item.id)
                              );
                            }}
                          >
                            <svg width="15" height="15" className={css.trashIcon}>
                              <use xlinkHref="/sprite.svg#trash"></use>
                            </svg>{' '}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* ДЖЕНЕРАЛ */}
                <section className={css.generalInfoSection}>
                  <h2 className={css.generalTitle}>General Information</h2>

                  <label className={css.label} htmlFor="title">
                    Recipe Title
                  </label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    className={css.input}
                    placeholder="Enter the name of your recipe"
                  />
                  <ErrorMessage name="title" component="span" className={css.error} />

                  <label className={css.label} htmlFor="description">
                    Recipe Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className={`${css.input} ${css.textarea}`}
                    placeholder="Enter a brief description of your recipe"
                  />
                  <ErrorMessage name="description" component="span" className={css.error} />

                  <label className={css.label} htmlFor="time">
                    Cooking time in minutes
                  </label>
                  <Field id="time" name="time" type="text" className={css.input} placeholder="10" />
                  <ErrorMessage name="time" component="span" className={css.error} />

                  <div className={css.twoColumns}>
                    <div>
                      <label className={css.label} htmlFor="calories">
                        Calories
                      </label>
                      <Field
                        id="calories"
                        name="calories"
                        type="text"
                        className={css.input}
                        placeholder="150 cals"
                      />
                      <ErrorMessage name="calories" component="span" className={css.error} />
                    </div>

                    <div>
                      <label className={css.label} htmlFor="category">
                        Category
                      </label>
                      <Field
                        as="select"
                        id="category"
                        name="category"
                        className={`${css.input} ${css.selectInput} ${!values.category ? css.selectPlaceholder : ''}`}
                        disabled={categoriesLoading}
                      >
                        <option value="" disabled hidden>
                          Soup
                        </option>
                        {categories.map(category => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component="span" className={css.error} />
                    </div>
                  </div>
                </section>

                {/* ІНСТРУКЦІЇ */}
                <section className={css.instructionSection}>
                  <h2 className={css.instructionsTitle}>Instructions</h2>
                  <Field
                    as="textarea"
                    id="instructions"
                    name="instructions"
                    className={`${css.input} ${css.textarea} ${css.instructionsTextarea}`}
                    placeholder="Enter a text"
                  />
                  <ErrorMessage name="instructions" component="span" className={css.error} />
                </section>
              </div>

              {/* ПОЛЕТІЛИ */}
              <button
                type="submit"
                className={css.primaryButton}
                disabled={isSubmitting || isDataLoading}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
              </button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AddRecipeForm;
