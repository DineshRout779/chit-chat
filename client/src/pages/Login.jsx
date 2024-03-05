import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/auth/login', values);
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
      <div className='w-[90%] md:basis-1/2 p-4 px-8 mx-auto max-w-[480px]'>
        <h1 className='text-2xl font-medium'>Login to continue</h1>
        <form className='block w-full' onSubmit={handleSubmit}>
          <input
            type='text'
            name='username'
            id='username'
            value={username}
            onChange={handleInputChange}
            className='block my-4 border p-2 w-full border-gray-200 rounded-md'
            placeholder='Enter username'
          />
          <input
            type='password'
            name='password'
            id='password'
            value={password}
            onChange={handleInputChange}
            className='block my-4 border p-2 w-full border-gray-200 rounded-md'
            placeholder='Enter password'
          />
          <button
            type='submit'
            className='block p-2 my-4 w-full rounded-md bg-blue-600 text-white'
          >
            Login
          </button>
        </form>
        <p>
          Don&apos;t have an account?
          <Link className='text-blue-600' to='/signup'>
            {' '}
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
