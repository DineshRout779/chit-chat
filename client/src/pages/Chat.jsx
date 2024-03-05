import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import ChatContent from '../components/ChatContent';

const Chat = () => {
  const { state } = useAuth();
  // const [isConnected, setIsConnected] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatId, setChatId] = useState(true);

  useEffect(() => {
    const onMessagereceive = (response) => {
      // if (response.id === state.user._id) {
      //   console.log('my message: ', response);
      // } else {
      // }

      // console.log('message received: ', response);

      setChatHistory((prevHistory) => [...prevHistory, response]);

      setTimeout(() => {
        // if (chatRef.current) {
        //   chatRef.current.scrollTop = chatRef.current.scrollHeight;
        // }
      }, 100);
    };

    // const onRoomJoin = (message) => {
    //   console.log(message); // Log the server's response
    // };

    socket.on('chat message', onMessagereceive);
    // socket.emit('joinRoom', 'room1');

    // socket.on('roomJoined', onRoomJoin);
  }, [state.user._id]);

  // useEffect(() => {
  //   socket.connect();

  //   socket.on('connect', () => setIsConnected(true));

  //   return () => {
  //     socket.disconnect();
  //     socket.on('disconnect', () => setIsConnected(false));
  //   };
  // }, []);

  return (
    <div className='h-screen flex'>
      <Sidebar />
      {chatId && <ChatContent />}
    </div>
  );
};

export default Chat;
