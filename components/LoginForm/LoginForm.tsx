'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { ApiError } from '@/app/api/api';
import Loading from '@/app/loading';
import css from './LoginForm.module.css';

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .max(128, 'Email must be at most 128 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .required('Password is required'),
});

const PasswordInput = ({
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  hasError,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  hasError: boolean;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className={css.passwordWrapper}>
      <input
        id={id}
        name={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="off"
        className={`${css.input}${hasError ? ` ${css.inputError}` : ''}`}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className={css.eyeBtn}
      >
        {/* Заменяем Next.js компонент Image на SVG из нашего спрайта */}
        <svg width={24} height={24} className={css.eyeIcon}>
          <use href={show ? '/sprite.svg#open-eye' : '/sprite.svg#close-eye'} />
        </svg>
      </button>
    </div>
  );
};

const LoginForm = () => {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        const user = await login({
          email: values.email,
          password: values.password,
        });

        setUser(user);
        formik.resetForm();
        router.push('/');
      } catch (error) {
        showToast(
          (error as ApiError).response?.data?.error ??
            (error as ApiError).message ??
            'Login failed',
          false
        );
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  const inputClass = (name: keyof typeof formik.values) =>
    `${css.input}${formik.touched[name] && formik.errors[name] ? ` ${css.inputError}` : ''}`;

  if (isLoading) return <Loading />;

  return (
    <>
      <div className={css.card}>
        <h2 className={css.title}>Login</h2>

        <form onSubmit={formik.handleSubmit} noValidate className={css.form}>
          {/* Email */}
          <div className={css.fieldGroup}>
            <label htmlFor="email" className={css.label}>
              Enter your email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@gmail.com"
              autoComplete="off"
              className={inputClass('email')}
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <span className={css.error}>{formik.errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className={css.fieldGroup}>
            <label htmlFor="password" className={css.label}>
              Input password
            </label>
            <PasswordInput
              id="password"
              placeholder="*********"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              hasError={!!(formik.touched.password && formik.errors.password)}
            />
            {formik.touched.password && formik.errors.password && (
              <span className={css.error}>{formik.errors.password}</span>
            )}
          </div>

          <button type="submit" disabled={isLoading} className={css.submitBtn}>
            Login
          </button>

          <div className={css.regWrap}>
            <p className={css.regText}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className={css.regLink}>
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>

      {toast && (
        <div className={css.toast} style={{ background: toast.ok ? '#2e7d32' : '#c80000' }}>
          {toast.msg}
        </div>
      )}
    </>
  );
};

export default LoginForm;
