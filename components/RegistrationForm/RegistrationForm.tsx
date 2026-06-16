'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { ApiError } from '@/app/api/api';
import Loading from '@/app/loading';
import css from './RegistrationForm.module.css';

const registerSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .max(128, 'Email must be at most 128 characters')
    .required('Email is required'),
  name: Yup.string().max(16, 'Name must be at most 16 characters').required('Name is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
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
        <Image src={show ? '/eye.svg' : '/eye-closed.svg'} alt="" width={24} height={24} />
      </button>
    </div>
  );
};

const RegistrationForm = () => {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const formik = useFormik({
    initialValues: { email: '', name: '', password: '', confirmPassword: '' },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        const user = await register({
          name: values.name,
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
            'Registration failed',
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
        <h2 className={css.title}>Register</h2>
        <p className={css.subtitle}>
          Join our community of culinary enthusiasts, save your favorite recipes, and share your
          cooking creations
        </p>

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

          {/* Name */}
          <div className={css.fieldGroup}>
            <label htmlFor="name" className={css.label}>
              Enter your name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Max"
              autoComplete="off"
              className={inputClass('name')}
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name && (
              <span className={css.error}>{formik.errors.name}</span>
            )}
          </div>

          {/* Password */}
          <div className={css.fieldGroup}>
            <label htmlFor="password" className={css.label}>
              Create a strong password
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

          {/* Confirm Password */}
          <div className={`${css.fieldGroup} ${css.fieldGroupLast}`}>
            <label htmlFor="confirmPassword" className={css.label}>
              Repeat your password
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder="*********"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              hasError={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <span className={css.error}>{formik.errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" disabled={isLoading} className={css.submitBtn}>
            Create account
          </button>
        </form>

        <div className={css.loginWrap}>
          <p className={css.loginText}>Already have an account?</p>
          <Link href="/auth/login" className={css.loginLink}>
            Log in
          </Link>
        </div>
      </div>

      {toast && (
        <div className={css.toast} style={{ background: toast.ok ? '#2e7d32' : '#c80000' }}>
          {toast.msg}
        </div>
      )}
    </>
  );
};

export default RegistrationForm;
