import { useAuth } from '../../hooks/useAuth';
import useChats from '../../hooks/useChats';

const ChatMessages = () => {
  const {
    state: { messages },
  } = useChats();
  const {
    state: { user },
  } = useAuth();

  return (
    <div className='p-4 h-[81vh]'>
      {messages.length ? (
        messages.map((message) => (
          <div
            key={message._id}
            className={`flex my-2 ${message.sender._id === user._id ? '' : ''}`}
          >
            <p
              className={`p-2 px-4 rounded-full w-fit ${
                message.sender._id === user._id
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-200 dark:bg-zinc-800 text-gray-300'
              }`}
            >
              {message.content}
            </p>
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
