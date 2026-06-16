import ProfileNavigation from "@/components/ProfileNavigation/ProfileNavigation";

type Props = {
  params: Promise<{ recipeType: string[] }>;
};

export default async function ProfilePage({ params }: Props) {
  const { recipeType } = await params;

  return (
    <div>
      <h1>My profile</h1>
      <ProfileNavigation />
      <p>Current path: {recipeType?.join(' / ') || 'home'}</p>
    </div>
  );
}
