import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SignOut } from 'phosphor-react';

const SidebarFooter = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className='mt-auto p-4'>
      <button
        onClick={handleLogout}
        className='hover:bg-red-400 flex items-center gap-2 font-medium  text-white w-full p-3 px-4 rounded-md'
      >
        <SignOut size={24} /> Logout
      </button>
    </div>
  );
};

export default SidebarFooter;
