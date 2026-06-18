'use client';

import css from './ModalLogout.module.css';
import Modal from '@/components/Modal/Modal';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';

export default function LogoutModal() {
  const router = useRouter();
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  const handleConfirm = async () => {
    await logout();
    clearIsAuthenticated();
    handleClose();
    router.push('/');
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <h2 className={css.title}>Are you sure?</h2>
      <p className={css.text}>We will miss you!</p>
      <div className={css.buttonContainer}>
        <button className={css.cancelBtn} onClick={handleClose}>
          Cancel
        </button>
        <button className={css.logoutBtn} onClick={handleConfirm}>
          Log out
        </button>
      </div>
    </Modal>
  );
}
