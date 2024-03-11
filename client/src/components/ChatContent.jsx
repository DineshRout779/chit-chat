import { Outlet } from 'react-router-dom';
import ChatList from './ChatList';
import useChats from '../hooks/useChats';

const ChatContent = () => {
  const {
    state: { selectedProfile },
  } = useChats();

  return (
    <div className='relative flex w-full'>
      <ChatList />
      <Outlet />
    </div>
  );
};

export default ChatContent;
