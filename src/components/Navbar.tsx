import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.png';
import { getAuth, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const auth = getAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignout = async () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setModalOpen(false);
  }, []);

  return (
    <div className='flex justify-between items-center p-3 rounded-md bg-gray-100'>
      <Link
        to='/chats'
        className='text-base font-semibold md:text-xl ml-2  p-1 md:p-2 text-blue-800'
      >
        ChitChat
      </Link>

      <div className='relative flex profile'>
        <button
          className='flex gap-3 items-center bg-white border-2 border-blue-700 rounded-full md:rounded-md md:p-2 md:px-4'
          onClick={() => setModalOpen(!modalOpen)}
        >
          <h2 className='text-sm font-medium hidden md:block'>Dinesh</h2>
          <img
            src={avatar}
            alt='user avatar'
            className='w-8 h-8 rounded-full'
          />
        </button>

        {modalOpen && (
          <div className='profile-dropdown w-[200px] shadow-md bg-white p-1 border rounded-md absolute top-16 right-0 divide-y'>
            <Link
              to='/profile'
              className='block text-left rounded-md p-2 px-4 hover:bg-blue-100'
            >
              Profile
            </Link>
            <button
              onClick={handleSignout}
              className='block text-left rounded-md w-full p-2 px-4 hover:bg-blue-100'
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
