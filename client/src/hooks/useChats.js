import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

const useChats = () => useContext(ChatContext);

export default useChats;
