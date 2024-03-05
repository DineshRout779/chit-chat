import { useState } from 'react';

const SidebarHeader = () => {
  const [isConnected, setIsConnected] = useState(true);
  return (
    <div className='p-4'>
      <div className='flex gap-2 items-center mb-4'>
        <p className='font-medium text-xl dark:text-white'>Chatty</p>
        <small>{isConnected ? '🟢' : '🔴'}</small>
      </div>
      <div className='flex gap-2 items-center'>
        <input
          name='search'
          id='search'
          placeholder='Search for an user'
          className='grow p-3 text-sm rounded-md bg-zinc-800'
        />
      </div>
    </div>
  );
};

export default SidebarHeader;
