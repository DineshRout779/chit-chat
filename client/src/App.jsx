import './App.css';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className='bg-white dark:bg-[#2a292b]'>
      <Outlet />
    </div>
  );
}
