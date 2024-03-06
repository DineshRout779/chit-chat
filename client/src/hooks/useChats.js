import { useContext } from 'react';
import { ChatContext } from '../context/chatContext';

const useChats = () => useContext(ChatContext);

export default useChats;
