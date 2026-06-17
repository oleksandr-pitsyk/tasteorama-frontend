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
  handleResetFilters: () => void;
}

const FiltersControls = ({
  categoryParams,
  ingredientParams,
  categories,
  ingredients,
  handleCategoryChange,
  handleIngredientChange,
  handleResetFilters,
}: FiltersControlsProps) => {
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
      <button onClick={handleResetFilters} className={css.resetButton}>
        Reset filters
      </button>
    </div>
  );
};

export default FiltersControls;
