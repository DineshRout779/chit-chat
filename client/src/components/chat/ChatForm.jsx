import { PaperPlaneTilt } from 'phosphor-react';
import { useRef, useState } from 'react';
import apiClient from '../../services/apiClient';
import useChats from '../../hooks/useChats';
import { socket } from '../../socket';

const ChatForm = () => {
  const {
    state: { selectedChat },
    newMessage,
  } = useChats();
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef(null);
  const typingRef = useRef(false);

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!typingRef.current) {
      typingRef.current = true;
      socket.emit('typing', selectedChat._id);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop typing', selectedChat._id);
      typingRef.current = false;
    }, 3000);
  };

  const handleBlur = () => {
    clearTimeout(typingTimeoutRef.current);
    socket.emit('stop typing', selectedChat._id);
    typingRef.current = false;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient.post('/api/messages', {
        chatId: selectedChat._id,
        content: message,
      });

      // console.log(res);

      if (res.status === 201) {
        setMessage('');
        newMessage(res.data.message);
        socket.emit('new message', res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className='absolute bottom-0 left-0 right-0 flex gap-2 items-center m-4'
    >
      <input
        type='text'
        name='message'
        id='message'
        placeholder='Type your message here...'
        value={message}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className='py-3 px-4 block w-full border outline-none border-gray-300 rounded-md text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-gray-600'
      />
      <button className='bg-blue-500 p-3 border border-blue-500 text-sm px-4 rounded-md flex items-center gap-2 text-white'>
        <p className='hidden md:block'>Send</p> <PaperPlaneTilt size={16} />
      </button>
    </form>
  );
};

export default ChatForm;
