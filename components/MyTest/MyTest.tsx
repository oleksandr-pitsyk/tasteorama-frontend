// Імпорт модуля Link для навігації між сторінками
import Link from 'next/link';

// Імпортуємо функцію
import { getCategories } from '@/lib/api/api-myTest';
import { getIngredients } from '@/lib/api/api-myTest';
import { getRecipes } from '@/lib/api/api-myTest';
import { getRecipeById } from '@/lib/api/api-myTest';

const MyTest = async () => {
  // 3. Виконуємо запит
  const categories = await getCategories();
  const ingredients = await getIngredients();
  const recipes = await getRecipes(2, 6, 'Tart', 'Dessert');
  const recipeById = await getRecipeById('6462a8f74c3d0ddd28897fbc');

  return (
    <div>
      MyTest
      <p>
        Categories:{' '}
        {categories.data.map(category => (
          <span key={category._id}>{category.name}</span>
        ))}
      </p>
      <p>
        Ingredients:{' '}
        {ingredients.data.map(ingredient => (
          <span key={ingredient._id}>{ingredient.name}</span>
        ))}
      </p>
      <ul>
        Recipes:{' '}
        {recipes.data.map(recipe => (
          <li key={recipe._id}>
            <Link href={`/recipes/${recipe._id}`}>{recipe.title}</Link>
          </li>
        ))}
      </ul>
      <p>Recipe by Id:</p>
      <p>{recipeById.data.title}</p>
      <p>{recipeById.data.description}</p>
    </div>
  );
};

export default MyTest;
