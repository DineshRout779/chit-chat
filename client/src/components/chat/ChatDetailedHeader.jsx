import { CaretLeft, DotsThree } from 'phosphor-react';
import useChats from '../../hooks/useChats';
import { useEffect, useState } from 'react';
import { socket } from '../../socket';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const ChatDetailedHeader = () => {
  const {
    state: { chats, selectedChat },
    selectChat,
    viewProfile,
  } = useChats();
  const {
    state: { user },
  } = useAuth();
  const navigate = useNavigate();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const [isTyping, setIsTyping] = useState(false);

  const handleBack = () => {
    navigate('/chat');
    selectChat(null);
  };

  const handleProfileToggle = (id) => {
    viewProfile(id);
  };

  const getUserChattingWith = () => {
    const id = selectedChat?._id;
    const chat = chats.find((chat) => chat?._id === id);

    return chat?.users?.find((c) => c?._id !== user?._id);
  };

  useEffect(() => {
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  return (
    <div className='p-4 border-b border-b-zinc-500/25 flex justify-between items-center'>
      <div className='font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2'>
        <button
          onClick={handleBack}
          className='hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-md'
        >
          <CaretLeft size={24} />
        </button>
        <div className='flex-col'>
          <div
            className='cursor-pointer'
            onClick={() => handleProfileToggle(getUserChattingWith()._id)}
          >
            <p> {getUserChattingWith()?.username} </p>{' '}
          </div>

          {getUserChattingWith()?.status === 'Online' ? (
            isTyping ? (
              <p className='text-xs dark:text-zinc-400'>Typing</p>
            ) : (
              <p className='text-xs dark:text-zinc-400'>online</p>
            )
          ) : (
            <p className='text-xs dark:text-zinc-400'>offline</p>
          )}
        </div>
      </div>

      <div className='relative'>
        <button
          onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          className='dark:text-gray-200'
        >
          <DotsThree size={24} />
        </button>
        <div
          className={`transition-all delay-200 origin-top-right absolute top-10 right-0 rounded-md bg-zinc-800 py-2 ${
            isOptionsOpen ? 'scale-100' : 'scale-0'
          }`}
        >
          <Link
            to='/profile'
            className='block text-sm text-gray-200 w-[120px] text-left p-2 px-4  hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-gray-200'
          >
            View profile
          </Link>
          <button className='block text-sm text-gray-200 w-[120px] text-left p-2 px-4  hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-gray-200'>
            Delete chat
          </button>
          <button className='block text-sm text-gray-200 w-[120px] text-left p-2 px-4  hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-gray-200'>
            Mark as read
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailedHeader;
