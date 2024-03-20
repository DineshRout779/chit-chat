import { useParams } from 'react-router-dom';
import ChatDetailedHeader from '../components/chat/ChatDetailedHeader';
import ChatForm from '../components/chat/ChatForm';
import ChatMessages from '../components/chat/ChatMessages';
import useChats from '../hooks/useChats';
import { useEffect } from 'react';
import Profile from '../components/Profile';
import apiClient from '../services/apiClient';

const ChatDetailed = () => {
  const {
    state: { selectedChat, selectedProfile },
    selectChat,
    setChats,
  } = useChats();
  const { id } = useParams();

  useEffect(() => {
    if (!selectedChat && id) {
      (async () => {
        try {
          const res = await apiClient.get(`/api/chats`);

          setChats(res.data.chats);
        } catch (error) {
          console.log(error);
        }
      })();
      (async () => {
        try {
          const res = await apiClient.get(`/api/chats/${id}`);

          selectChat(res.data.chat);
        } catch (error) {
          console.log(error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
