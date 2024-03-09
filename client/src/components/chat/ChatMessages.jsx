import { useLayoutEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import useChats from '../../hooks/useChats';
import { motion } from 'framer-motion';

const ChatMessages = () => {
  const {
    state: { messages },
  } = useChats();
  const {
    state: { user },
  } = useAuth();
  const messagesRef = useRef();

  useLayoutEffect(() => {
    const scrollToBottom = () => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    };
    setTimeout(scrollToBottom, 100);
  }, [messages.length]);

  return (
    <div
      ref={messagesRef}
      className='p-4 h-[81vh] overflow-y-auto chat-history'
    >
      {messages.length ? (
        messages.map((message) => (
          <div
            key={message._id}
            className={`flex my-2 ${message.sender._id === user._id ? '' : ''}`}
          >
            <motion.p
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className={`p-2 px-4 rounded-full w-fit ${
                message.sender._id === user._id
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-200 dark:bg-zinc-800 text-gray-300'
              }`}
            >
              {message.content}
            </motion.p>
          </div>
        ))
      ) : (
        <div className='h-full flex justify-center items-center'>
          <p className='dark:text-gray-200'>No messages yet.</p>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
