/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from 'react';
import actionTypes from '../constants/actionTypes';

const intialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
};

export const AuthContext = createContext(null);

const authReducers = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducers, intialState);

  const loginUser = (user) => {
    dispatch({ type: actionTypes.LOGIN, payload: user });
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: actionTypes.LOGOUT });
  };

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ state, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
