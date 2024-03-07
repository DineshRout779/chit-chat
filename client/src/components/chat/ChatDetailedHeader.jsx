import { CaretLeft, DotsThree } from 'phosphor-react';
import useChats from '../../hooks/useChats';

const ChatDetailedHeader = () => {
  const {
    state: { selectedChat },
  } = useChats();
  return (
    <div className='p-4 border-b border-b-zinc-500/25 flex justify-between items-center'>
      <h3 className='font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2'>
        <button className='hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-md'>
          <CaretLeft size={24} />
        </button>
        {selectedChat.users[0].username}
      </h3>

      <button className='dark:text-gray-200'>
        <DotsThree size={24} />
      </button>
    </div>
  );
};

export default ChatDetailedHeader;
