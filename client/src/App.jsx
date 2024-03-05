import './App.css';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className='bg-white h-full dark:bg-zinc-900 bg-gradient-to-r from-cyan-500 to-blue-500'>
      <Outlet />
    </div>
  );
}
