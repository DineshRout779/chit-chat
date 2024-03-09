// import useSocket from '../hooks/useSocket';

const SidebarHeader = () => {
  // const {
  //   state: { isConnected },
  // } = useSocket();

  return (
    <div className='p-4'>
      <img
        src='https://cryptologos.cc/logos/chatcoin-chat-logo.png'
        className='block aspect-square w-12 h-12'
        alt='logo'
      />
      {/* <small>{isConnected ? '🟢' : '🔴'}</small> */}
    </div>
  );
};

export default SidebarHeader;
