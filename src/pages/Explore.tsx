import { useState } from 'react';
import { collection } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [username, setUsername] = useState('');
  const [value, loading, error] = useCollection(collection(db, 'users'));

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

  if (error) {
    return <strong>Error: {JSON.stringify(error)}</strong>;
  }

  if (loading) {
    return <span>Collection: Loading...</span>;
  }

  return (
    <div className='mx-auto max-w-[360px] min-h-[80vh] flex flex-col'>
      <h1 className='text-xl my-4 mb-2 md:mt-8 font-semibold'>
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

      {value && (
        <>
          {value.docs.map((doc) => (
            <div
              key={doc.id}
              className='my-2 flex items-center justify-between'
            >
              <div className='flex items-center gap-4'>
                <img
                  src={doc.data().photoURL}
                  alt=''
                  className='w-8 h-8 rounded-full'
                />

                <h3 className='text-base font-semibold'>
                  {doc.data().displayName}
                </h3>
              </div>
              <button className='bg-blue-600 p-2 uppercase px-8 text-sm rounded-md text-white'>
                Add
              </button>
            </div>
          ))}
        </>
      )}

      <Link
        to='/chats'
        className='w-fit mx-auto mt-auto bg-blue-600 p-2 uppercase px-8 text-sm rounded-md text-white'
      >
        Let's go{' '}
      </Link>
    </div>
  );
};
export default Explore;
