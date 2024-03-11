import { FunnelSimple, Plus } from 'phosphor-react';
import useChats from '../hooks/useChats';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const {
    state: { chats, loading },
    selectChat,
  } = useChats();
  const {
    state: { user },
  } = useAuth();
  const navigate = useNavigate();

  const handleChatSelect = (chatId) => {
    selectChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  // to be reused later
  // const handleChatCreateOrGet = async (chatId) => {
  //   try {
  //     const res = await apiClient.post('/chats', {
  //       selectedUserId: chatId,
  //     });

  //     console.log('chat created or got', res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className='w-full basis-full md:basis-5/12 border-r border-gray-200 dark:border-r-zinc-800 px-4 bg-white/90 dark:bg-black/75 backdrop-blur-3xl'>
      {/* header */}
      <div className='flex justify-between items-center my-4 '>
        <h2 className='text-zinc-900 dark:text-white'>Chats</h2>
        <button className='hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-md'>
          <Plus className='text-blue-400' size={24} />
        </button>
      </div>

      {/* search & filter */}
      <div className='flex gap-2 items-center my-4'>
        <input
          name='search'
          id='search'
          placeholder='Search for an user'
          className='block w-full p-3 text-sm rounded-md bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 border-zinc-800 outline-none focus:border-blue-600'
        />
        <button className='bg-gray-200 dark:bg-zinc-800 p-3 rounded-md'>
          <FunnelSimple className='text-blue-400 text-start' />
        </button>
      </div>

      {/* chat list */}
      <div className='overflow-y-auto h-[80vh] chat-history'>
        {loading ? (
          <p className='dark:text-gray-200'>Loading...</p>
        ) : (
          <ul className='pr-2'>
            {chats.map((chat) => {
              const receiver = chat.users.find(
                (participant) => participant._id !== user?._id
              );

              return (
                <li
                  key={chat._id}
                  onClick={() => handleChatSelect(chat._id)}
                  className='cursor-pointer rounded-md my-2 hover:bg-blue-500 dark:hover:bg-zinc-800 flex w-full gap-4 bg-white dark:bg-zinc-900 p-4'
                >
                  <div className='relative inline-block'>
                    <img
                      className='inline-block size-8 rounded-full'
                      src={receiver.profilePic}
                      alt={receiver.username}
                      loading='lazy'
                    />
                    <span
                      className={
                        receiver.status === 'Online'
                          ? 'absolute top-0 end-0 block size-2 rounded-full ring-1 ring-white dark:ring-black  bg-lime-400'
                          : ''
                      }
                    ></span>
                  </div>
                  <div className=''>
                    <h2 className='text-md dark:text-slate-300'>
                      {receiver.username}
                    </h2>
                    <p className='text-gray-500 text-sm'>
                      {chat?.latestMessage?.content ||
                        'Tap to start chatting...'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatList;
