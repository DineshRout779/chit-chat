// import Sidebar from '../components/Sidebar';
import ChatContent from '../components/ChatContent';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const {
    state: { token },
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/');
  }, [navigate, token]);

  if (!token) {
    return null;
  }

  return (
    <div className='h-screen flex'>
      {/* <Sidebar /> */}
      <ChatContent />
    </div>
  );
};

export default Chat;
