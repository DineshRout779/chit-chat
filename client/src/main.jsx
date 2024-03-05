// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Chat from './pages/Chat.jsx';
import AuthContextProvider from './context/authContext.jsx';
import Signup from './pages/Signup.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/chat',
        element: <Chat />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <AuthContextProvider>
    <RouterProvider router={router} />
  </AuthContextProvider> // </React.StrictMode>
);
