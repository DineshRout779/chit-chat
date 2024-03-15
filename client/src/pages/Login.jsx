import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../services/apiClient';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const Login = () => {
  const { state, loginUser } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(4, 'Must be 4 characters or more')
        .required('Required'),
      password: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await apiClient.post('/api/auth/login', values);
        if (res.status === 200) {
          toast.success('Loggedin successfully');
          loginUser(res.data.token);
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.log(error.response);
      }
    },
  });

  const getGuestCredentials = () => {
    formik.setValues({
      username: 'dinesh',
      password: '7*#kDp9@LnF2!wT',
    });
  };

  useEffect(() => {
    if (state.token) navigate('/chat');
  }, [navigate, state.token]);

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
          <h1 className='text-2xl font-medium dark:text-gray-200'>Login</h1>
          <p className='text-sm dark:text-gray-400'>Login to continue </p>
          <form className='block w-full' onSubmit={formik.handleSubmit}>
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
              Login
            </button>
            <button
              type='button'
              onClick={getGuestCredentials}
              className='block p-2 my-4 w-full rounded-md bg-gray-400 dark:bg-zinc-600 text-white'
            >
              Login as guest
            </button>
          </form>
          <div className='flex justify-between items-center'>
            <Link to='/forget-password' className='text-sm text-blue-400'>
              Forgot password
            </Link>
            <Link className='text-sm text-blue-400' to='/signup'>
              Create an account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
