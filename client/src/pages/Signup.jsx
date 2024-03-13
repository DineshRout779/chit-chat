import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';
import { motion } from 'framer-motion';

const Signup = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
  });
  const { username, email, password } = values;

  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient.post('/api/auth/signup', values);
      if (res.status === 201) {
        navigate('/');
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
          className='w-full p-4 px-6 md:px-8 mx-auto max-w-[480px]'
        >
          <h1 className='text-2xl my-2 font-medium dark:text-white'>Signup</h1>
          <p className='text-sm dark:text-gray-400'>
            Create an account to get started
          </p>
          <form className='block w-full' onSubmit={handleSubmit}>
            {/* username */}
            <input
              type='text'
              name='username'
              id='username'
              value={username}
              onChange={handleInputChange}
              className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500  disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
              placeholder='Enter username'
            />

            {/* email */}
            <input
              type='email'
              name='email'
              id='email'
              value={email}
              onChange={handleInputChange}
              className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500  disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
              placeholder='Enter email'
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
