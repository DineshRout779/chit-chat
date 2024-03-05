import { Chat, GearSix, Question, Users } from 'phosphor-react';
import { Link } from 'react-router-dom';

const SidebarContent = () => {
  return (
    <div className='px-4'>
      <Link
        to='/'
        className='text-gray-700 flex items-center gap-2 font-medium dark:text-gray-200 hover:bg-blue-600 rounded-md my-2 p-3 px-4 '
      >
        <Chat size={24} /> Messages
      </Link>
      <Link
        to='/'
        className='text-gray-700 flex items-center gap-2 font-medium dark:text-gray-200 hover:bg-blue-600 rounded-md my-2 p-3 px-4 '
      >
        <Users size={24} /> Friends
      </Link>
      <Link
        to='/'
        className='text-gray-700 flex items-center gap-2 font-medium dark:text-gray-200 hover:bg-blue-600 rounded-md my-2 p-3 px-4 '
      >
        <GearSix size={24} /> Settings
      </Link>
      <Link
        to='/'
        className='text-gray-700 flex items-center gap-2 font-medium dark:text-gray-200 hover:bg-blue-600 rounded-md my-2 p-3 px-4 '
      >
        <Question size={24} /> Help
      </Link>
    </div>
  );
};

export default SidebarContent;
