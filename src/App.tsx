import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className='container md:w-[95%] mx-auto max-w-[1400px] p-3 md:p-6 rounded-md min-h-screen md:min-h-[80vh] bg-white'>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
