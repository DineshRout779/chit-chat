import { Outlet, useParams } from 'react-router-dom';
import ChatList from './ChatList';
import useScreenWidth from '../hooks/useScreenWidth';

const ChatContent = () => {
  const { id } = useParams();
  const screenWidth = useScreenWidth();

  return (
    <div className='relative flex w-full'>
      {id && screenWidth <= 768 ? null : <ChatList />}
      <Outlet />
    </div>
  );
};

export default ChatContent;
