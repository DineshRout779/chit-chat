/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from 'react';
import actionTypes from '../constants/actionTypes';
import apiClient from '../services/apiClient';
import { socket } from '../socket';
import { useAuth } from '../hooks/useAuth';

const initialState = {
  selectedChat: null,
  chats: [],
  loading: false,
  messages: [],
  refetch: false,
  selectedProfile: null,
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
    case actionTypes.REFETCH:
      return {
        ...state,
        refetch: !state.refetch,
      };
    case actionTypes.RELOAD_SELECTEDCHAT:
      return {
        ...state,
        selectedChat: state.chats.find(
          (chat) => chat._id === state.selectedChat._id
        ),
      };
    case actionTypes.PROFILE_SELECTED:
      return {
        ...state,
        selectedProfile: action.payload,
      };
    case actionTypes.PROFILE_DESELECTED:
      return {
        ...state,
        selectedProfile: null,
      };
    default:
      return state;
  }
};

const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducers, initialState);
  const {
    state: { token },
  } = useAuth();

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

  const refresh = () => {
    dispatch({ type: actionTypes.REFETCH });
  };

  const viewProfile = (id) => {
    dispatch({ type: actionTypes.PROFILE_SELECTED, payload: id });
  };

  const closeProfile = () => {
    dispatch({ type: actionTypes.PROFILE_DESELECTED });
  };

  const toggleProfile = (id) => {
    if (!state.selectedProfile) {
      viewProfile(id);
    } else {
      closeProfile();
    }
  };

  // fetch chats
  useEffect(() => {
    token &&
      (async () => {
        try {
          startLoading();
          const res = await apiClient.get('/api/chats');

          setChats(res.data.chats);
        } catch (error) {
          console.log(error);
        } finally {
          stopLoading();
        }
      })();
  }, [state.messages.length, token, state.refetch]);

  // fetch messages if any chatId is selected
  useEffect(() => {
    state.selectedChat &&
      (async () => {
        try {
          const res = await apiClient.get(
            `/api/messages/${state.selectedChat._id}`
          );

          setMessages(res.data.messages);

          socket.emit('joinChat', state.selectedChat._id);
        } catch (error) {
          console.log(error);
        }
      })();
  }, [state.selectedChat, state.refetch]);

  useEffect(() => {
    socket.on('message received', (newMsg) => {
      newMessage(newMsg);
    });
  }, []);

  useEffect(() => {
    socket.on('userOnline', () => {
      refresh();
      dispatch({ type: actionTypes.RELOAD_SELECTEDCHAT });
    });
  }, []);

  useEffect(() => {
    socket.on('userOffline', () => {
      refresh();
      dispatch({ type: actionTypes.RELOAD_SELECTEDCHAT });
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
        viewProfile,
        closeProfile,
        toggleProfile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
