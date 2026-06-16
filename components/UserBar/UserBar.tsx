import css from './UserBar.module.css';

interface UserBarProps {
  name: string;
  onLogout: () => void;
}

const UserBar = ({ name, onLogout }: UserBarProps) => {
  return (
    <li className={css.userBarItem}>
      <div className={css.userBar}>
        <div className={css.userInfo}>
          <div className={css.avatar}>{name.charAt(0).toUpperCase()}</div>

          <span className={css.name}>{name}</span>
        </div>

        <div className={css.divider} />

        <button className={css.logoutBtn} onClick={onLogout} aria-label="Logout">
          <svg width="24" height="24">
            <use href="/icons/icons.svg#icon-logout" />
          </svg>
        </button>
      </div>
    </li>
  );
};

export default UserBar;
