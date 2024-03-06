import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../services/apiClient';

// TODO: Add toasts for interactive responses
const ForgetPassword = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // TODO: Validations
  const handleGenerateOTP = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient.post('/auth/forget-password', { email });

      if (res.data.success) {
        setOtpGenerated(true);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  // TODO: Validations
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient.post('/auth/verify-otp', { email, otp });

      if (res.data.success) {
        setOtpVerified(true);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  // TODO: Validations
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient.post('/auth/reset-password', {
        email,
        password,
      });

      if (res.data.success) {
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
      <div className='md:basis-1/2 w-full flex flex-col justify-center items-center bg-white/75 dark:bg-black/75 backdrop-blur-3xl min-h-screen'>
        {otpGenerated ? (
          otpVerified ? (
            // if  OTP is verified, show form to update the user password
            <div className='w-full p-4 px-8 mx-auto max-w-[480px]'>
              <h1 className='text-2xl font-medium my-2 dark:text-gray-200'>
                Reset Password
              </h1>
              <p className='text-sm dark:text-gray-400'>
                Please provide a strong password
              </p>
              <form className='block w-full' onSubmit={handleUpdatePassword}>
                {/* password */}
                <input
                  type='password'
                  name='password'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
                  placeholder='Enter new password'
                />
                {/* confirm password */}
                <input
                  type='password'
                  name='confirmPassword'
                  id='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
                  placeholder='Confirm password'
                />

                <button
                  type='submit'
                  className='block p-2 my-4 w-full rounded-md bg-blue-600 text-white'
                >
                  Update password
                </button>
              </form>
            </div>
          ) : (
            // showform to enter OTP
            <div className='w-full p-4 px-8 mx-auto max-w-[480px]'>
              <h1 className='text-2xl font-medium my-2 dark:text-gray-200'>
                Verify OTP
              </h1>
              <p className='text-sm dark:text-gray-400'>
                Find the OTP sent through email
              </p>
              <form className='block w-full' onSubmit={handleVerifyOTP}>
                {/* email */}
                <input
                  type='otp'
                  name='otp'
                  id='otp'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
                  placeholder='Enter One Time Password'
                />
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  OTP expires in
                </p>
                <button
                  type='submit'
                  className='block p-2 my-4 w-full rounded-md bg-blue-600 text-white'
                >
                  Verify
                </button>
              </form>
            </div>
          )
        ) : (
          // show form to enter email to generate OTP
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
            className='w-full p-4 px-8 mx-auto max-w-[480px]'
          >
            <h1 className='text-2xl font-medium my-2 dark:text-gray-200'>
              Forget Password?
            </h1>
            <p className='text-sm dark:text-gray-400'>
              Reset Password through email
            </p>
            <form className='block w-full' onSubmit={handleGenerateOTP}>
              {/* email */}
              <input
                type='email'
                name='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
                placeholder='Enter email'
              />
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                An email will be sent to your registered email address with a
                One Time Password for ver
              </p>
              <button
                type='submit'
                className='block p-2 my-4 w-full rounded-md bg-blue-600 text-white'
              >
                Send OTP
              </button>
            </form>
          </motion.div>
        )}
        <p className='text-gray-500'>
          Click here to{' '}
          <Link className='text-blue-500' to='/'>
            Cancel
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
