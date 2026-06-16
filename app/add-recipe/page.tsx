import AddRecipeForm from '@/components/AddRecipeForm/AddRecipeForm';
import css from './page.module.css';

const AddRecipePage = () => {
  return (
    <main className={css.page}>
      <h1 className={css.title}>Add Recipe</h1>

      <AddRecipeForm />
    </main>
  );
};

export default AddRecipePage;
