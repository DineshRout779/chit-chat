import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { unstable_useBlocker } from 'react-router-dom';
import { auth } from '../utils/firebaseConfig';

export const AppContext = createContext(null as any);

export const AppContextProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<{} | null>();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log('User: ', user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AppContext.Provider value={{ currentUser }}>
      {children}
    </AppContext.Provider>
  );
};
