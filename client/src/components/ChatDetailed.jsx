import useChats from '../hooks/useChats';
import ChatDetailedHeader from './chat/ChatDetailedHeader';
import ChatForm from './chat/ChatForm';
import ChatMessages from './chat/ChatMessages';

const ChatDetailed = () => {
  const {
    state: { selectedChat },
  } = useChats();

  return (
    <div className='relative w-full h-full bg-white/90 dark:bg-black/75 backdrop-blur-3xl md:grow'>
      <>
        {!selectedChat ? (
          <div className='h-full flex justify-center items-center'>
            <p className='dark:text-gray-50'>Select a chat</p>
          </div>
        ) : (
          <>
            <ChatDetailedHeader />
            <ChatMessages />
            <ChatForm />
          </>
        )}
      </>
    </div>
  );
};

export default ChatDetailed;
