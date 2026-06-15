import { getRecipeById } from '@/lib/api/api';

type Props = {
  params: Promise<{ recipeId: string }>;
};

const RecipeViewPage = async ({ params }: Props) => {
  const { recipeId } = await params;
  console.log('RecipeViewPage - recipeid:', recipeId);
  // const recipeById = await getRecipeById('6462a8f74c3d0ddd28897fbc');
  const recipe = await getRecipeById(recipeId);

  return (
    <div>
      RecipeViewPage
      <p>Recipe by Id:</p>
      <p>{recipe.data.title}</p>
      <p>{recipe.data.description}</p>
    </div>
  );
};

export default RecipeViewPage;
