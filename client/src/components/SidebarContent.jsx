import { Chat, GearSix, Question, Users } from 'phosphor-react';
import { NavLink } from 'react-router-dom';

const SidebarContent = () => {
  return (
    <div className='px-4'>
      <NavLink
        to='/'
        className='text-gray-700 flex items-center gap-2 font-medium dark:text-gray-200 hover:bg-blue-600 hover:text-white rounded-md my-2 p-3 px-4 '
      >
        <Chat size={24} /> Messages
      </NavLink>
      <NavLink
        to='/'
        className='text-gray-700 flex items-center gap-2 font-medium dark:text-gray-200 hover:bg-blue-600 hover:text-white rounded-md my-2 p-3 px-4 '
      >
        <Users size={24} /> Friends
      </NavLink>
      <NavLink
        to='/'
        className='text-gray-700 flex items-center gap-2 font-medium dark:text-gray-200 hover:bg-blue-600 hover:text-white rounded-md my-2 p-3 px-4 '
      >
        <GearSix size={24} /> Settings
      </NavLink>
      <NavLink
        to='/'
        className='text-gray-700 flex items-center gap-2 font-medium dark:text-gray-200 hover:bg-blue-600 hover:text-white rounded-md my-2 p-3 px-4 '
      >
        <Question size={24} /> Help
      </NavLink>
    </div>
  );
};

export default SidebarContent;
