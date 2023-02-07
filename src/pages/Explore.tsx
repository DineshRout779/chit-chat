import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

type User = {
  displayName: string;
  photoURL: string;
  email: string;
};

const Explore = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<User[]>();

  // const searchUser = async () => {
  //   const usersRef = collection(db, 'users');
  //   const q = query(usersRef, where('displayName', '==', username));
  //   try {
  //     const querySnapshot = await getDocs(q);
  //     console.log(querySnapshot);
  //     querySnapshot.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       console.log(doc.id, ' => ', doc.data());
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handleKey = (e: any) => {
  //   console.log(e.code);
  //   e.code === 'Enter' && searchUser();
  // };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        let usersList: User[] = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const { displayName, email, photoURL } = doc.data();
          usersList.push({
            displayName,
            email,
            photoURL,
          });
        });
        setUsers(usersList);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className='mx-auto max-w-[360px]'>
      <h1 className='text-xl mt-8 my-4 font-semibold'>
        Add Peoples you want to chat
      </h1>
      {/* <input
        type='text'
        value={username}
        name='username'
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKey}
        placeholder='Type a name and press enter'
        className='block w-full p-2 rounded-md border border-gray-300 outline-none focus:border-blue-600'
      /> */}
    </div>
  );
};
export default Explore;
