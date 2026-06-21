'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './ProfileNavigation.module.css';

const tabs = [
  { href: '/profile/own', label: 'My Recipes' },
  { href: '/profile/favorites', label: 'Saved Recipes' },
];

const ProfileNavigation = () => {
  const pathname = usePathname();

  return (
    <div className = {css.wrapper}>
      <nav className={css.nav} aria-label="Profile sections">
        {tabs.map(tab => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${css.tab} ${isActive ? css.active : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>

  );
};

export default ProfileNavigation;
