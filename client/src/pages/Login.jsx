import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../services/apiClient';

const Login = () => {
  const { state, loginUser } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  const { username, password } = values;

  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const getGuestCredentials = () => {
    setValues({
      ...values,
      username: 'dinesh',
      password: '12345',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient.post('/auth/login', values);
      if (res.status === 200) {
        loginUser(res.data.user);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

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
          className='w-[90%] p-4 px-8 mx-auto max-w-[480px]'
        >
          <h1 className='text-2xl font-medium dark:text-gray-200'>Login</h1>
          <p className='text-sm dark:text-gray-400'>Login to continue </p>
          <form className='block w-full' onSubmit={handleSubmit}>
            <input
              type='text'
              name='username'
              id='username'
              value={username}
              onChange={handleInputChange}
              className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500  disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
              placeholder='Enter username'
            />

            {/* password */}
            <input
              type='password'
              name='password'
              id='password'
              value={password}
              onChange={handleInputChange}
              className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
              placeholder='Enter password'
            />
            <Link to='/forget-password' className='text-sm text-blue-400'>
              Forgot password
            </Link>
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
          <p className='dark:text-gray-200'>
            Don&apos;t have an account?
            <Link className='text-blue-600' to='/signup'>
              {' '}
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
