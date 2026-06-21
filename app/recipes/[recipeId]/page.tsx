import { getRecipeById } from '@/lib/api/clientApi';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';

type Props = {
  params: Promise<{ recipeId: string }>;
};

const RecipeViewPage = async ({ params }: Props) => {
  const { recipeId } = await params;
  const response = await getRecipeById(recipeId);
  const recipe = response.recipe;

  return <RecipeDetails recipe={recipe} />;
};

export default RecipeViewPage;
