import ChatDetailed from './ChatDetailed';
import ChatList from './ChatList';

const ChatContent = () => {
  return (
    <div className='relative flex w-full'>
      <ChatList />
      <ChatDetailed />
    </div>
  );
};

export default ChatContent;
