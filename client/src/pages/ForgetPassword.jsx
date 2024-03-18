import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../services/apiClient';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

// TODO: Add toasts for interactive responses
const ForgetPassword = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const otpGenerationForm = useFormik({
    initialValues: {
      email: 'dineshoutr@gmail.com',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Required').email(),
    }),
    onSubmit: async (values) => {
      try {
        setFormDisabled(true);
        const res = await apiClient.post('/api/auth/forget-password', {
          email: values.email,
        });

        if (res.data.success) {
          toast.success('OTP sent');
          setOtpGenerated(true);
          setCountdown(30);
        }
      } catch (error) {
        toast.error('Unable to generate OTP');
        console.log(error.response);
      } finally {
        setFormDisabled(false);
      }
    },
  });

  const otpVerifcationForm = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required('Required')
        .min(6, 'OTP must be 6 characters')
        .max(6, 'OTP must be of 6 characters'),
    }),
    onSubmit: async (values) => {
      try {
        setFormDisabled(true);

        const res = await apiClient.post('/api/auth/verify-otp', {
          email,
          otp: values.otp,
        });

        if (res.data.success) {
          toast.success('OTP Verified');
          setOtpVerified(true);
        }
      } catch (error) {
        toast.error('OTP invalid');
        console.log(error.response);
      } finally {
        setFormDisabled(false);
      }
    },
  });

  const passwordUpdateForm = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Required')
        .min(6, 'Password must be 6 characters or more'),
      confirmPassword: Yup.string()
        .required('Required')
        .min(6, 'Password must be 6 characters or more')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      try {
        setFormDisabled(true);

        const res = await apiClient.post('/api/auth/reset-password', {
          email,
          password: values.password,
        });

        if (res.data.success) {
          toast.success('Password reset successfully');
          navigate('/');
        }
      } catch (error) {
        toast.error('An error occurred');
        console.log(error.response);
      } finally {
        setFormDisabled(false);
      }
    },
  });

  const resendOTP = async () => {
    try {
      const res = await apiClient.post('/api/auth/forget-password', {
        email,
      });

      if (res.data.success) {
        toast.success('OTP sent');
        setCountdown(30);
      }
    } catch (error) {
      toast.error('Unable to resend OTP');
      console.log(error.response);
    }
  };

  const { email } = otpGenerationForm.values;
  const { otp } = otpVerifcationForm.values;
  const { password, confirmPassword } = passwordUpdateForm.values;

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  useEffect(() => {
    if (state.user) navigate('/chat');
  }, [navigate, state.user]);

  return (
    <div className='flex justify-center items-center'>
      <div className='md:basis-1/2 bg-blue-600 min-h-screen'></div>
      <div className='md:basis-1/2 w-full flex flex-col justify-center items-center bg-white/75 dark:bg-black/75 backdrop-blur-3xl min-h-screen'>
        {otpGenerated ? (
          otpVerified ? (
            // Update password form
            <div className='w-full p-4 md:px-8 mx-auto max-w-[480px]'>
              <h1 className='text-2xl font-medium my-2 dark:text-gray-200'>
                Reset Password
              </h1>
              <p className='text-sm dark:text-gray-400'>
                Please provide a strong password
              </p>
              <form
                className='block w-full'
                onSubmit={passwordUpdateForm.handleSubmit}
              >
                {/* password */}
                <input
                  type='password'
                  name='password'
                  id='password'
                  value={password}
                  onChange={passwordUpdateForm.handleChange}
                  className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
                  placeholder='Enter new password'
                />
                {passwordUpdateForm.touched.password &&
                passwordUpdateForm.errors.password ? (
                  <p className='text-xs text-red-500 mb-2'>
                    {passwordUpdateForm.errors.password}
                  </p>
                ) : null}

                {/* confirm password */}
                <input
                  type='password'
                  name='confirmPassword'
                  id='confirmPassword'
                  value={confirmPassword}
                  onChange={passwordUpdateForm.handleChange}
                  className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
                  placeholder='Confirm password'
                />
                {passwordUpdateForm.touched.confirmPassword &&
                passwordUpdateForm.errors.confirmPassword ? (
                  <p className='text-xs text-red-500 mb-2'>
                    {passwordUpdateForm.errors.confirmPassword}
                  </p>
                ) : null}

                <button
                  disabled={formDisabled}
                  type='submit'
                  className='block p-2 my-4 w-full rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {formDisabled ? 'Updating password...' : 'Update password'}
                </button>
              </form>
            </div>
          ) : (
            // OTP Verification form
            <div className='w-full p-4 md:px-8 mx-auto max-w-[480px]'>
              <h1 className='text-2xl font-medium my-2 dark:text-gray-200'>
                Verify OTP
              </h1>
              <p className='text-sm dark:text-gray-400'>
                Find the OTP sent through email
              </p>
              <form
                className='block w-full'
                onSubmit={otpVerifcationForm.handleSubmit}
              >
                {/* email */}
                <input
                  type='otp'
                  name='otp'
                  id='otp'
                  value={otp}
                  onChange={otpVerifcationForm.handleChange}
                  className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
                  placeholder='Enter One Time Password'
                />
                {otpVerifcationForm.touched.otp &&
                otpVerifcationForm.errors.otp ? (
                  <p className='text-xs text-red-500 mb-2'>
                    {otpVerifcationForm.errors.otp}
                  </p>
                ) : null}

                <button
                  disabled={formDisabled}
                  type='submit'
                  className='block p-2 my-4 w-full rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {formDisabled ? 'Verifying OTP...' : 'Verify'}
                </button>

                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Resend OTP in: 00:{countdown}s
                </p>

                {countdown === 0 && (
                  <button
                    type='button'
                    onClick={resendOTP}
                    className='my-2 p-2 px-4 rounded-md bg-blue-600 text-sm text-white'
                  >
                    Resend OTP
                  </button>
                )}
              </form>
            </div>
          )
        ) : (
          // OTP generation form
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
            className='w-full p-4 md:px-8 mx-auto max-w-[480px]'
          >
            <h1 className='text-2xl font-medium my-2 dark:text-gray-200'>
              Forget Password?
            </h1>
            <p className='text-sm dark:text-gray-400'>
              Reset Password through email
            </p>
            <form
              className='block w-full'
              onSubmit={otpGenerationForm.handleSubmit}
            >
              {/* email */}
              <input
                type='email'
                name='email'
                id='email'
                value={email}
                onChange={otpGenerationForm.handleChange}
                className='py-3 px-4 my-4 block w-full border outline-none border-gray-500 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
                placeholder='Enter email'
              />
              {otpGenerationForm.touched.email &&
              otpGenerationForm.errors.email ? (
                <p className='text-xs text-red-500 mb-2'>
                  {otpGenerationForm.errors.email}
                </p>
              ) : null}

              <p className='text-xs text-gray-500 dark:text-gray-400'>
                An email will be sent to your registered email address with a
                One Time Password for ver
              </p>
              <button
                disabled={formDisabled}
                type='submit'
                className='block p-2 my-4 w-full rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {formDisabled ? 'Sending OTP...' : 'Send OTP'}
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
