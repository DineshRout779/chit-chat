import { Link } from 'react-router-dom';

const ResetPassword = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='md:basis-1/2 bg-blue-600 min-h-screen'></div>
      <div className='md:basis-1/2 w-full flex justify-center items-center bg-white/75 dark:bg-black/75 backdrop-blur-3xl min-h-screen'>
        {otpGenerated ? (
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
              <p className='text-gray-500'>
                Click here to{' '}
                <Link className='text-blue-500' to='/'>
                  Cancel
                </Link>
              </p>
            </form>
          </motion.div>
        ) : (
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
              <p className='text-gray-500'>
                Click here to{' '}
                <Link className='text-blue-500' to='/'>
                  Cancel
                </Link>
              </p>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;
