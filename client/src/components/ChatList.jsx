import { faker } from '@faker-js/faker';
import { FunnelSimple, Plus } from 'phosphor-react';

const ChatList = () => {
  return (
    <div className='basis-1 md:basis-5/12 lg:basis-4/12 border-r border-gray-200 dark:border-r-zinc-800 px-4 bg-white/90 dark:bg-black/75 backdrop-blur-3xl'>
      {/* header */}
      <div className='flex justify-between items-center my-4 '>
        <h2 className='text-zinc-900 dark:text-white'>Chats</h2>
        <button className='hover:bg-zinc-800 p-2 rounded-md'>
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
      <div className='overflow-y-scroll h-[80vh] chat-history'>
        <ul className='pr-2'>
          {Array.from({ length: 20 }).map((_, i) => (
            <li
              key={i}
              className='cursor-pointer rounded-md my-2 hover:bg-gray-200 dark:hover:bg-zinc-800 flex w-full gap-4 bg-white dark:bg-zinc-900 p-4'
            >
              <div className='relative'>
                <img
                  src={faker.image.avatar()}
                  className='w-10 h-10 aspect-square rounded-full'
                  alt={faker.person.fullName()}
                  loading='lazy'
                />
                <span className='absolute w-3 h-3 bottom-2 right-0 bg-green-500 rounded-full'></span>
              </div>
              <div className=''>
                <h2 className='text-md dark:text-slate-300'>
                  {faker.person.fullName()}
                </h2>
                <p className='text-gray-500 text-sm'>
                  {faker.lorem.text().length > 20
                    ? faker.lorem.text().slice(0, 20) + '...'
                    : faker.lorem.text()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
