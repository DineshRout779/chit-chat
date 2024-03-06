import Sidebar from '../components/Sidebar';
import ChatContent from '../components/ChatContent';

const Chat = () => {
  return (
    <div className='h-screen flex'>
      <Sidebar />
      <ChatContent />
    </div>
  );
};

export default Chat;
