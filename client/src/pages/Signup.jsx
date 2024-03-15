import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const Signup = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(4, 'Must be 4 characters or more')
        .required('Required'),
      email: Yup.string().required('Required').email('Invalid email address'),
      password: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        const res = await apiClient.post('/api/auth/signup', values);
        if (res.status === 201) {
          toast.success('Signup successfully');
          navigate('/');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred');
        console.log(error.response);
      }
    },
  });

  useEffect(() => {
    if (state.user) navigate('/chat');
  }, [navigate, state.user]);

  return (
    <div className='flex justify-center items-center'>
      <div className='md:basis-1/2 bg-blue-600 min-h-screen'></div>
      <div className='md:basis-1/2 w-full flex justify-center items-center bg-white/75 dark:bg-black/75 backdrop-blur-3xl min-h-screen'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: {
              ease: 'easeIn',
              duration: 1,
            },
          }}
          className='w-full p-4 px-6 md:px-8 mx-auto max-w-[480px]'
        >
          <h1 className='text-2xl my-2 font-medium dark:text-white'>Signup</h1>
          <p className='text-sm dark:text-gray-400'>
            Create an account to get started
          </p>
          <form className='block w-full' onSubmit={formik.handleSubmit}>
            {/* username */}
            <input
              type='text'
              name='username'
              id='username'
              value={formik.values.username}
              onChange={formik.handleChange}
              className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500  disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
              placeholder='Enter username'
            />
            {formik.touched.username && formik.errors.username ? (
              <p className='text-xs text-red-500'>{formik.errors.username}</p>
            ) : null}

            {/* email */}
            <input
              type='email'
              name='email'
              id='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500  disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
              placeholder='Enter email'
            />
            {formik.touched.email && formik.errors.email ? (
              <p className='text-xs text-red-500'>{formik.errors.email}</p>
            ) : null}

            {/* password */}
            <input
              type='password'
              name='password'
              id='password'
              value={formik.values.password}
              onChange={formik.handleChange}
              className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
              placeholder='Enter password'
            />
            {formik.touched.password && formik.errors.password ? (
              <p className='text-xs text-red-500'>{formik.errors.password}</p>
            ) : null}

            <button
              type='submit'
              className='block p-2 my-4 w-full rounded-md bg-blue-600 text-white'
            >
              Create account
            </button>
          </form>
          <p className='dark:text-gray-200'>
            Already have an account?{' '}
            <Link className='text-blue-600 ' to='/'>
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
export default Signup;
