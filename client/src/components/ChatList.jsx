import {
  CircleDashed,
  DotsThreeVertical,
  FunnelSimple,
  GearSix,
  Plus,
  SignOut,
  UserCircle,
} from 'phosphor-react';
import useChats from '../hooks/useChats';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import SearchUserItem from './SearchUserItem';
import debounce from 'lodash/debounce';

const ChatList = () => {
  const {
    state: { chats, loading },
    selectChat,
  } = useChats();
  const {
    state: { user },
  } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { id } = useParams();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChatSelect = (chatId) => {
    selectChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  const handleChatCreateOrGet = async (userId) => {
    try {
      const res = await apiClient.post('/api/chats', {
        selectedUserId: userId,
      });

      if (res.status === 200) selectChat(res.data.chat._id);
      navigate(`/chat/${res.data.chat._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await apiClient.get(`/api/users?username=${query}`);
      if (res.status === 200) {
        setSearchResults(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchUsers = useCallback(debounce(handleSearch, 500), [query]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsSearching(newQuery.length > 0);
  };

  useEffect(() => {
    if (query.length > 0) searchUsers();

    return () => {
      searchUsers.cancel();
    };
  }, [query, searchUsers]);

  return (
    <div
      className={`transition-all md:basis-5/12 border-r border-gray-200 dark:border-r-zinc-800 px-4 bg-white/90 dark:bg-black/75 backdrop-blur-3xl ${
        id ? 'w-0 basis-0' : 'w-full basis-full'
      }`}
    >
      {/* header */}
      <div className='flex justify-between items-center my-4 relative'>
        <h2 className='text-zinc-900 dark:text-white'>Chats</h2>

        {/* actions */}
        <div className='flex gap-2'>
          <button className='hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-md'>
            <CircleDashed className='text-sky-400' size={24} />
          </button>
          <button className='hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-md'>
            <Plus className='text-sky-400' size={24} />
          </button>
          <button
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            className='hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-md'
          >
            <DotsThreeVertical className='text-sky-400' size={24} />
          </button>
        </div>

        {/* options */}
        <div
          className={`transition-all delay-200 origin-top-right absolute top-12 right-0 rounded-md bg-zinc-800 py-2 ${
            isOptionsOpen ? 'scale-100' : 'scale-0'
          }`}
        >
          <Link
            to='/profile'
            className='flex items-center gap-2 text-sm text-gray-200 w-[120px] text-left p-2 px-4  hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-gray-200'
          >
            <UserCircle size={16} /> Profile
          </Link>
          <Link
            to='/settings'
            className='flex items-center gap-2 text-sm text-gray-200 w-[120px] text-left p-2 px-4  hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-gray-200'
          >
            <GearSix size={16} /> Settings
          </Link>
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 text-sm text-gray-200 w-[120px] text-left p-2 px-4  hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-gray-200'
          >
            <SignOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* search & filter */}
      <div className='flex gap-2 items-center my-4'>
        <input
          name='search'
          id='search'
          placeholder='Search for an user'
          value={query}
          onChange={handleInputChange}
          className='block w-full p-3 text-sm rounded-md bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 border-zinc-800 outline-none focus:border-blue-600'
        />
        <button className='bg-gray-200 dark:bg-zinc-800 p-3 rounded-md'>
          <FunnelSimple className='text-blue-400 text-start' />
        </button>
      </div>

      {/* chat list */}
      {!isSearching ? (
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
      ) : (
        <div>
          <h2 className='dark:text-gray-200 '>Search results</h2>
          <ul className='pr-2'>
            {searchResults.map((user) => {
              return (
                <SearchUserItem
                  key={user._id}
                  user={user}
                  handleUserSelect={handleChatCreateOrGet}
                />
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatList;
