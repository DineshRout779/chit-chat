import { Link } from 'react-router-dom';

const Chats = () => {
  return (
    <div className='mt-48 flex justify-center items-center flex-col teext-center'>
      <h1 className='text-2xl md:text-4xl font-bold mb-2'>Chats are empty!</h1>
      <p className='text-gray-800 text-sm md:text-base'>
        Please explore people to chat
      </p>

      <Link
        to='/explore'
        className='px-4 py-2 rounded-md my-4 bg-blue-700 text-white font-bold'
      >
        Explore people
      </Link>
    </div>
  );
};

export default Chats;
