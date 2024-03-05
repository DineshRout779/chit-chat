/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from 'react';

const intialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
};

export const AuthContext = createContext(null);

const authReducers = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
  }
};

export default function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducers, intialState);

  const loginUser = (user) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    localStorage.removeItem('user');

    dispatch({ type: 'LOGOUT' });
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
