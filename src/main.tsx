import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { AppContextProvider } from './context/AppContext';
import './index.css';
import Chats from './pages/Chats';
import Explore from './pages/Explore';
import Welcome from './pages/Welcome';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'chats',
        element: <Chats />,
      },
      {
        path: 'explore',
        element: <Explore />,
      },
    ],
  },
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Welcome />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppContextProvider>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </AppContextProvider>
);
