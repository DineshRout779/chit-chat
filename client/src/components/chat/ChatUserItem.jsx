/* eslint-disable react/prop-types */
const ChatUserItem = ({ chat, receiver }) => {
  return (
    <li
      key={chat._id}
      // onClick={() => handleChatSelect(chat._id)}
      className='cursor-pointer rounded-md my-2 hover:bg-blue-500 dark:hover:bg-zinc-800 flex w-full gap-4 bg-white dark:bg-zinc-900 p-4'
    >
      <div className='relative inline-block'>
        <img
          className='inline-block size-12 rounded-full'
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
        <h2 className='text-md dark:text-slate-300'>{receiver.username}</h2>
        <p className='text-gray-500 text-sm'>
          {chat?.latestMessage?.content || 'Tap to start chatting...'}
        </p>
      </div>
    </li>
  );
};

export default ChatUserItem;
