import { useParams } from 'react-router-dom';
import ChatDetailedHeader from '../components/chat/ChatDetailedHeader';
import ChatForm from '../components/chat/ChatForm';
import ChatMessages from '../components/chat/ChatMessages';
import useChats from '../hooks/useChats';
import { useEffect } from 'react';
import Profile from '../components/Profile';

const ChatDetailed = () => {
  const {
    state: { selectedChat, selectedProfile },
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
    <div className='relative w-full h-full flex bg-white/90 dark:bg-black/75 backdrop-blur-3xl md:grow '>
      <div
        className={`transition-all border-r border-gray-200 dark:border-r-zinc-800 ${
          selectedProfile ? 'w-8/12' : 'w-full'
        }`}
      >
        <ChatDetailedHeader />
        <ChatMessages />
        <ChatForm />
      </div>
      {selectedProfile && <Profile />}
    </div>
  );
};

export default ChatDetailed;
