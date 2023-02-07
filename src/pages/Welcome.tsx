import GoogleButton from 'react-google-button';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

const Welcome = () => {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential: any = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)

      console.log(user);

      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });

        // localStorage.setItem('user', JSON.stringify({
        //     uid: user.uid,
        //   displayName: user.displayName,
        //   email: user.email,
        //   photoURL: user.photoURL,
        // }))

        await setDoc(doc(db, 'userChats', user.uid), {});

        navigate('/chats');
      }
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    }
  };

  return (
    <div className='min-h-[90vh] flex justify-center items-center flex-col'>
      <h1 className='text-4xl my-2'>ChitChat</h1>
      <p className='text-gray-800 mb-4'>Hangouts with friends</p>
      <GoogleButton type='dark' onClick={handleLogin} />
    </div>
  );
};

export default Welcome;
