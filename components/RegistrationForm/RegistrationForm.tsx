'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
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
  // ============================================================================
  // Тест на валідність email - ВІДКЛЮЧЕНИЙ !!!
  // .matches(
  //   /^[a-zA-Z0-9_.+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+$/,
  //   'Invalid email format: no spaces, cyrillic or special characters allowed'
  // )
  // ============================================================================
  // Тест на валідність @ в email - ВІДКЛЮЧЕНИЙ !!!
  // .test('has-at', 'Email must contain "@"', val => !!val && val.includes('@')),
  // ============================================================================
  // Тест на валідність домена в email - ВІДКЛЮЧЕНИЙ !!!
  // .test(
  //   'valid-domain',
  //   'Email must end with .com, .net or .ua',
  //   val => !!val && /\.(com|net|ua)$/i.test(val)
  // ),
  // ============================================================================
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
        <svg width={24} height={24} className={css.eyeIcon}>
          <use xlinkHref={show ? '/sprite.svg#open-eye' : '/sprite.svg#close-eye'} />
        </svg>
      </button>
    </div>
  );
};

const RegistrationForm = () => {
  const router = useRouter();
  const setIsOpenRegisterLoginForm = useAuthStore(state => state.setIsOpenRegisterLoginForm);

  useEffect(() => {
    setIsOpenRegisterLoginForm(true);
    return () => {
      setIsOpenRegisterLoginForm(false);
    };
  }, [setIsOpenRegisterLoginForm]);

  const setUser = useAuthStore(state => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', name: '', password: '', confirmPassword: '' },
    validationSchema: registerSchema,
    validateOnChange: true,
    validateOnBlur: true,
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
        toast.success('Registration successful!');
        router.push('/');
      } catch (error) {
        const status = (error as ApiError).response?.status;

        // Помилка створюється фронтендом в залежності від коду статусу відповіді бекенда
        if (status === 409) {
          // Користувач вже є в БД
          toast.error('A user with this email is already registered');
        } else if (status === 400) {
          // Невірний запит
          toast.error('Invalid email. Please try again.');
        } else {
          toast.error(
            (error as ApiError).response?.data?.error ??
              (error as ApiError).message ??
              'Registration failed'
          );
        }
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
      <Toaster position="top-right" />

      <div className={css.card}>
        <h2 className={css.title}>Register</h2>
        <p className={css.subtitle}>
          Join our community of culinary enthusiasts, save your favorite recipes, and share your
          cooking creations
        </p>

        <form onSubmit={formik.handleSubmit} noValidate className={css.form}>
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

          <button
            type="submit"
            disabled={isLoading || (formik.dirty && !formik.isValid)}
            className={css.submitBtn}
          >
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
    </>
  );
};

export default RegistrationForm;
