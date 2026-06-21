import { notFound } from 'next/navigation';
import ProfileNavigation from '@/components/ProfileNavigation/ProfileNavigation';
import RecipesList from '@/components/RecipesList/RecipesList';
import css from './page.module.css';
type Props = {
  params: Promise<{ recipeType: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { recipeType } = await params;

  if (recipeType !== 'own' && recipeType !== 'favorites') {
    notFound();
  }

  return (
    <div className={css.profile_container}>
      <div className="container">
        <h1 className={css.profile_header}>My profile</h1>
        <ProfileNavigation />
      </div>
      <RecipesList recipeType={recipeType} />
    </div>
  );
}
