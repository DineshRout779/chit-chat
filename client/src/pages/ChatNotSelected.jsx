import useScreenWidth from '../hooks/useScreenWidth';

const ChatNotSelected = () => {
  const screenWidth = useScreenWidth();

  if (screenWidth <= 768) {
    return null;
  }

  return (
    <div className='relative w-full h-full bg-white/90 dark:bg-black/75 backdrop-blur-3xl md:grow'>
      <div className='h-full flex justify-center items-center'>
        <p className='dark:text-gray-50'>Select a chat</p>
      </div>
    </div>
  );
};

export default ChatNotSelected;
