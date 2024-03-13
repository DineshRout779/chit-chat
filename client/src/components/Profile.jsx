import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import useChats from '../hooks/useChats';
import { X } from 'phosphor-react';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const {
    state: { selectedProfile },
    closeProfile,
  } = useChats();

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get(`/api/users/${selectedProfile}`);

        if (res.status === 200) {
          setUserData(res.data.user);
        }
      } catch (error) {
        console.log(error.response);
      }
    })();
  }, [selectedProfile]);

  return (
    <div className='w-4/12 transition-all'>
      {/* user profile header */}
      <div className='p-4 border-b border-b-zinc-500/25 flex items-center gap-4'>
        <button
          onClick={closeProfile}
          className='hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-md'
        >
          <X className='text-gray-400' size={24} />
        </button>
        <h1 className='text-lg dark:text-gray-200'>Contact info</h1>
      </div>

      {/* user details */}
      <div className='flex flex-col items-center'>
        <img
          src={userData?.profilePic}
          alt='User'
          className='w-28 h-28 rounded-full aspect-square mx-auto my-4 mt-8'
        />
        <h1 className='text-xl dark:text-gray-50'>{userData?.username}</h1>
        <p className='dark:text-gray-500 text-sm my-2'>{userData?.status}</p>
      </div>
    </div>
  );
};

export default Profile;
