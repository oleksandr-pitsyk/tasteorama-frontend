import { getRecipeById } from '@/lib/api/clientApi';
// import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';

type Props = {
  params: Promise<{ recipeId: string }>;
};

const RecipeViewPage = async ({ params }: Props) => {
  const { recipeId } = await params;
  console.log('RecipeViewPage - recipeid:', recipeId);
  // const recipeById = await getRecipeById('6462a8f74c3d0ddd28897fbc');
  const recipe = await getRecipeById(recipeId);
  console.log('RecipeViewPage - recipe', recipe);

  return (
    <div>
      RecipeViewPage
      <p>Recipe by Id:</p>
      {/* <p>{recipe}</p>
      <p>{recipe.title}</p>
      <p>{recipe.description}</p> */}
      <p>RecipeDetails</p>
      {/* <RecipeDetails recipe={recipe} /> */}
    </div>
  );
};

export default RecipeViewPage;
