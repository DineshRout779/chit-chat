import './App.css';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className='bg-white h-full dark:bg-zinc-900 bg-[url("https://images.pexels.com/photos/1363876/pexels-photo-1363876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")] bg-no-repeat bg-cover'>
      <Outlet />
    </div>
  );
}
