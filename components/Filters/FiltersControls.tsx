'use client';

import css from './FiltersControls.module.css';
import { Category } from '@/types/category';
import { Ingredient } from '@/types/ingredient';
import CustomSelect from '@/components/Filters/CustomSelect';

interface FiltersControlsProps {
  categoryParams: string | null;
  ingredientParams: string | null;
  categories: Category[];
  ingredients: Ingredient[];
  handleCategoryChange: (value: string) => void;
  handleIngredientChange: (value: string) => void;
  handleResetSearchAndFilters: () => void;
}

const FiltersControls = ({
  categoryParams,
  ingredientParams,
  categories,
  ingredients,
  handleCategoryChange,
  handleIngredientChange,
  handleResetSearchAndFilters,
}: FiltersControlsProps) => {
  console.log('categories', categories);
console.log('isArray', Array.isArray(categories));
console.log('typeof', typeof categories);
  return (
    <div className={css.controls}>
      <div className={css.selectGroup}>
        <div className={css.selectWrapper}>
          <CustomSelect
            value={categoryParams || ''}
            placeholder="Category"
            options={categories.map(category => ({
              value: category.name,
              label: category.name,
            }))}
            onChange={handleCategoryChange}
          />
        </div>

        <div className={css.selectWrapper}>
          <CustomSelect
            value={ingredientParams || ''}
            placeholder="Ingredient"
            options={ingredients.map(ingredient => ({
              value: ingredient.name,
              label: ingredient.name,
            }))}
            onChange={handleIngredientChange}
          />
        </div>
      </div>
      <button onClick={handleResetSearchAndFilters} className={css.resetButton}>
        Reset filters
      </button>
    </div>
  );
};

export default FiltersControls;
