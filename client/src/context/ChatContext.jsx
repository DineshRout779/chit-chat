/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from 'react';
import actionTypes from '../constants/actionTypes';
import apiClient from '../services/apiClient';
import { socket } from '../socket';

const initialState = {
  selectedChat: null,
  chats: [],
  loading: false,
  messages: [],
};

export const ChatContext = createContext();

const chatReducers = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_CHATS:
      return {
        ...state,
        chats: action.payload,
      };
    case actionTypes.SELECT_CHAT:
      return {
        ...state,
        selectedChat: state.chats.find(
          (chat) => chat._id === action.payload.chatId
        ),
      };
    case actionTypes.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case actionTypes.NEW_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case actionTypes.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducers, initialState);

  const setChats = (chats) => {
    dispatch({ type: actionTypes.SET_CHATS, payload: chats });
  };

  const setMessages = (messages) => {
    dispatch({ type: actionTypes.SET_MESSAGES, payload: messages });
  };

  const newMessage = (message) => {
    dispatch({ type: actionTypes.NEW_MESSAGE, payload: message });
  };

  const selectChat = (chatId) => {
    dispatch({ type: actionTypes.SELECT_CHAT, payload: { chatId } });
  };

  const startLoading = () => {
    dispatch({ type: actionTypes.LOADING, payload: true });
  };

  const stopLoading = () => {
    dispatch({ type: actionTypes.LOADING, payload: false });
  };

  // fetch chats
  useEffect(() => {
    (async () => {
      try {
        startLoading();
        const res = await apiClient.get('/chats');

        setChats(res.data.chats);
      } catch (error) {
        console.log(error);
      } finally {
        stopLoading();
      }
    })();
  }, []);

  // fetch messages if any chatId is selected
  useEffect(() => {
    state.selectedChat &&
      (async () => {
        try {
          const res = await apiClient.get(
            `/messages/${state.selectedChat._id}`
          );

          setMessages(res.data.messages);

          socket.emit('joinChat', state.selectedChat._id);
        } catch (error) {
          console.log(error);
        }
      })();
  }, [state.selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMsg) => {
      console.log('message received', newMsg);
      newMessage(newMsg);
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        state,
        setChats,
        startLoading,
        stopLoading,
        selectChat,
        newMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
