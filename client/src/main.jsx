// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Chat from './pages/Chat.jsx';
import Signup from './pages/Signup.jsx';
import SocketProvider from './context/SocketContext.jsx';
import ChatProvider from './context/ChatContext.jsx';
import ForgetPassword from './pages/ForgetPassword.jsx';
import ChatNotSelected from './pages/ChatNotSelected.jsx';
import ChatDetailed from './pages/ChatDetailed.jsx';
import AuthProvider from './context/AuthContext.jsx';

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
        path: 'forget-password',
        element: <ForgetPassword />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/chat',
        element: <Chat />,
        children: [
          {
            index: true,
            element: <ChatNotSelected />,
          },
          {
            path: ':id',
            element: <ChatDetailed />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <AuthProvider>
    <ChatProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </ChatProvider>
  </AuthProvider>
  // </React.StrictMode>
);
