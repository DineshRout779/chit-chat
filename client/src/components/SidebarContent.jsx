import { Chat, GearSix, Question, Users } from 'phosphor-react';
import { NavLink } from 'react-router-dom';

const getClassName = (isActive) =>
  !isActive
    ? 'text-gray-700 block md:flex items-center gap-2 font-medium dark:text-gray-200 hover:bg-blue-600 hover:text-white rounded-md my-2 p-3 md:px-4'
    : 'text-gray-100 block md:flex items-center gap-2 font-medium bg-blue-600 hover:bg-blue-600 hover:text-white rounded-md my-2 p-3 md:px-4';

const SidebarContent = () => {
  return (
    <div className='px-4'>
      <NavLink to='/chat' className={({ isActive }) => getClassName(isActive)}>
        <Chat size={24} /> <p className='hidden md:block'>Messages</p>
      </NavLink>
      <NavLink to='/' className={({ isActive }) => getClassName(isActive)}>
        <Users size={24} /> <p className='hidden md:block'>Friends</p>
      </NavLink>
      <NavLink to='/' className={({ isActive }) => getClassName(isActive)}>
        <GearSix size={24} /> <p className='hidden md:block'>Settings</p>
      </NavLink>
      <NavLink to='/' className={({ isActive }) => getClassName(isActive)}>
        <Question size={24} /> <p className='hidden md:block'>Help</p>
      </NavLink>
    </div>
  );
};

export default SidebarContent;
