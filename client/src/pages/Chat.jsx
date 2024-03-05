import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatRef = useRef();
  const inputRef = useRef();

  // Handle sending messages
  const sendMessage = () => {
    if (message.trim()) {
      // Don't send empty messages
      socket.emit('chat message', {
        text: message,
        user: state.user._id,
      });
      setMessage('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const onMessagereceive = (response) => {
      // if (response.id === state.user._id) {
      //   console.log('my message: ', response);
      // } else {
      // }

      console.log('message received: ', response);

      setChatHistory((prevHistory) => [...prevHistory, response]);

      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 100);
    };

    // const onRoomJoin = (message) => {
    //   console.log(message); // Log the server's response
    // };

    socket.on('chat message', onMessagereceive);
    // socket.emit('joinRoom', 'room1');

    // socket.on('roomJoined', onRoomJoin);
  }, [state.user._id]);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => setIsConnected(true));

    return () => {
      socket.disconnect();
      socket.on('disconnect', () => setIsConnected(false));
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className='h-screen'>
      <header className='sticky top-0 flex justify-between  bg-white p-4 shadow-md gap-2'>
        <div className='flex gap-2  items-center'>
          <p className='font-semibold'> Node bot</p>
          <small>{isConnected ? '🟢' : '🔴'}</small>
        </div>

        <button
          className='bg-red-400 text-white font-medium p-2 px-4 rounded-md'
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      <div
        ref={chatRef}
        className='chat-history p-2 h-[85vh] overflow-y-scroll mb-8'
      >
        {/* {chatHistory.map((msg, index) => (
          <div
            className={`bg-gray-200 p-2 px-4 rounded-md my-2 w-fit max-w-60 ${
              msg.id === 
                ? 'ml-0 mr-auto'
                : 'mr-0 ml-auto bg-blue-500 text-white'
            }`}
            key={index}
          >
            <p>{msg.message}</p>
          </div>
        ))} */}
      </div>
      <div className='flex gap-2 items-center fixed bottom-0 left-0 right-0 m-2'>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          ref={inputRef}
          placeholder='Enter message...'
          className='grow border rounded-md border-gray-200 p-2'
        />
        <button
          className='w-fit p-2 px-4 rounded-md bg-green-600 text-white font-semibold'
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
