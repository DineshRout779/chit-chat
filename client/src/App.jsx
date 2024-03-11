import './App.css';
import { Outlet } from 'react-router-dom';

// TODO: Add toasts
export default function App() {
  return (
    <div className='bg-white h-full dark:bg-zinc-900 bg-[url("https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-no-repeat bg-cover'>
      <Outlet />
    </div>
  );
}
