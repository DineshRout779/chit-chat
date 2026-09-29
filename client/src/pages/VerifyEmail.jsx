import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import apiClient from '../services/apiClient';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const RESEND_COOLDOWN_SECONDS = 30;

const VerifyEmail = () => {
  const { state, loginUser } = useAuth();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string().length(6, 'Must be 6 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await apiClient.post('/api/auth/verify-otp', {
          otp: values.otp,
          email,
          purpose: 'EMAIL_VERIFICATION',
        });
        if (res.status === 200) {
          toast.success('Loggedin successfully');
          loginUser(res.data.token);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Invalid OTP');
      }
    },
  });

  const sendOtp = async () => {
    if (!email) {
      toast.error('Missing email, please login again');
      return;
    }

    try {
      setSending(true);
      const res = await apiClient.post('/api/auth/send-otp', {
        email,
        purpose: 'EMAIL_VERIFICATION',
      });
      if (res.status === 200) {
        toast.success('OTP sent, please check your inbox');
        setOtpSent(true);
        setCountdown(RESEND_COOLDOWN_SECONDS);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send OTP');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (state.token) navigate('/chat');
  }, [navigate, state.token]);

  return (
    <div className='flex justify-center items-center'>
      <div className='md:basis-1/2 bg-blue-600 min-h-screen flex justify-center items-center'>
        <img
          className='w-[80%]  block object-cover'
          src='./login.svg'
          alt='login'
        />
      </div>
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
          <h1 className='text-4xl text-blue-400 my-4 font-fenix'>Chatty</h1>{' '}
          <p className='text-sm dark:text-gray-400'>Verify your email</p>
          {!otpSent ? (
            <div>
              <p className='text-xs text-gray-500 dark:text-gray-400 my-4'>
                We need to verify {email || 'your email'} before you can log
                in. Click below to receive a one-time password.
              </p>
              <button
                type='button'
                disabled={sending}
                onClick={sendOtp}
                className='block p-2 my-4 w-full rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {sending ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <form className='block w-full' onSubmit={formik.handleSubmit}>
              <input
                type='text'
                name='otp'
                id='otp'
                value={formik.values.otp}
                onChange={formik.handleChange}
                className='py-3 px-4 my-4 mb-2 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500  disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
                placeholder='Enter otp'
              />
              <p className='text-gray-300 text-xs'>Please check your email</p>
              {formik.touched.otp && formik.errors.otp ? (
                <p className='text-xs text-red-500'>{formik.errors.otp}</p>
              ) : null}

              <button
                type='submit'
                disabled={state.isLoading}
                className='block p-2 my-4 w-full rounded-md bg-blue-600 text-white'
              >
                Verify
              </button>

              <p className='text-xs text-gray-500 dark:text-gray-400'>
                {countdown > 0
                  ? `Resend OTP in: ${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`
                  : ''}
              </p>

              {countdown === 0 && (
                <button
                  type='button'
                  disabled={sending}
                  onClick={sendOtp}
                  className='my-2 p-2 px-4 rounded-md bg-blue-600 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {sending ? 'Resending...' : 'Resend OTP'}
                </button>
              )}
            </form>
          )}
          <div className='flex justify-between items-center'>
            <Link to='/' className='text-sm text-blue-400'>
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default VerifyEmail;
