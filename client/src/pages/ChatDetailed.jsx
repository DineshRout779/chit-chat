import { useParams } from 'react-router-dom';
import ChatDetailedHeader from '../components/chat/ChatDetailedHeader';
import ChatForm from '../components/chat/ChatForm';
import ChatMessages from '../components/chat/ChatMessages';
import useChats from '../hooks/useChats';
import { useEffect } from 'react';

const ChatDetailed = () => {
  const {
    state: { selectedChat },
    selectChat,
  } = useChats();
  const { id } = useParams();

  useEffect(() => {
    if (!selectedChat) {
      selectChat(id);
    }
  }, [id, selectChat, selectedChat]);

  if (!selectedChat) {
    return null;
  }

  return (
    <div className='relative w-full h-full bg-white/90 dark:bg-black/75 backdrop-blur-3xl md:grow'>
      <ChatDetailedHeader />
      <ChatMessages />
      <ChatForm />
    </div>
  );
};

export default ChatDetailed;
