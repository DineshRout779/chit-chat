/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from 'react';
import actionTypes from '../constants/actionTypes';
import { socket } from '../socket';
import { useAuth } from '../hooks/useAuth';

const intialState = {
  isConnected: false,
};

export const SocketContext = createContext();

const socketReducers = (state, action) => {
  switch (action.type) {
    case actionTypes.CONNECT:
      return {
        ...state,
        isConnected: action.payload,
      };
    default:
      return state;
  }
};

const SocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducers, intialState);
  const {
    state: { user },
  } = useAuth();

  useEffect(() => {
    if (user) socket.connect();

    socket.on('connect', () => {
      console.log(socket);
      dispatch({ type: actionTypes.CONNECT, payload: socket.connected });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ state }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
