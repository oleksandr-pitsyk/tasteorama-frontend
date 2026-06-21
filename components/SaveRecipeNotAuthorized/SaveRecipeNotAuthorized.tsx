import Link from 'next/link';
import css from './SaveRecipeNotAuthorized.module.css';

export default function SaveRecipeNotAuthorized() {
  return (
    <div className={css.content}>
      <h2 className={css.title}>Error while saving</h2>

      <p className={css.text}>To save this recipe, you need to authorize first</p>

      <div className={css.actions}>
        <Link href="/auth/login" className={css.loginBtn}>
          Log in
        </Link>

        <Link href="/auth/register" className={css.registerBtn}>
          Register
        </Link>
      </div>
    </div>
  );
}
