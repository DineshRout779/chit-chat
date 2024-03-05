import './App.css';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className='bg-white h-full dark:bg-zinc-900'>
      <Outlet />
    </div>
  );
}
