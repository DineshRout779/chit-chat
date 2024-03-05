import { useContext } from 'react';
import { AuthContext } from '../context/authContext.jsx';

export const useAuth = () => useContext(AuthContext);
