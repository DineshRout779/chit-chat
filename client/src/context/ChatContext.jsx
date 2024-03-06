/* eslint-disable react/prop-types */
import { createContext, useReducer } from 'react';
import actionTypes from '../constants/actionTypes';

const initialState = {
  selectedChat: null,
  chats: [],
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
        selectedChat: action.payload,
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

  return (
    <ChatContext.Provider value={{ state, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
