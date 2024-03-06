/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from 'react';
import actionTypes from '../constants/actionTypes';
import apiClient from '../services/apiClient';

const intialState = {
  user: null,
  token: localStorage.getItem('token') || null,
};

export const AuthContext = createContext(null);

const authReducers = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        token: action.payload,
      };
    case actionTypes.STORE_USER:
      return {
        ...state,
        user: action.payload,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducers, intialState);

  const loginUser = (token) => {
    dispatch({ type: actionTypes.LOGIN, payload: token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: actionTypes.LOGOUT });
  };

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);

      // if token exists ==> fetch user
      (async () => {
        try {
          const res = await apiClient.get('/auth/loggedInUser');

          dispatch({ type: actionTypes.STORE_USER, payload: res.data.user });
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
