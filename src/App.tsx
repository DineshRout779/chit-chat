import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className='bg-blue-700 min-h-[100vh] md:py-4'>
      <div className='container md:w-[95%] mx-auto max-w-[1080px] p-3 md:p-6 rounded-md min-h-screen md:min-h-[95vh] bg-white'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
