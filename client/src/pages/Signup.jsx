import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Signup = () => {
  const { state } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/auth/signup', values);
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
      <div className='w-[90%] md:basis-1/2 p-4 px-8 mx-auto max-w-[480px]'>
        <h1 className='text-2xl mb-4 font-medium dark:text-white'>
          Login to continue
        </h1>
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

          {/* profile picture */}
          {/* <label htmlFor='small-file-input' className='sr-only'>
            Choose file
          </label>
          <input
            type='file'
            name='small-file-input'
            id='small-file-input'
            className='block w-full border border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600
            file:bg-gray-50 file:border-0
            file:me-4
            file:py-3 file:px-4
            dark:file:bg-black dark:file:text-gray-200'
            placeholder='Upload'
          /> */}
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
            {' '}
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
