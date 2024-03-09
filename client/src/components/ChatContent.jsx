import { Outlet } from 'react-router-dom';
import ChatList from './ChatList';

const ChatContent = () => {
  return (
    <div className='relative flex w-full'>
      <ChatList />
      <Outlet />
    </div>
  );
};

export default ChatContent;
