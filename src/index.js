import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.js';
import { SearchProvider } from './context/SearchContext.js'; // Eski haline getirildi

// import pages
import Login from './pages/Login.js';
import Register from "./pages/Register.js";
import Profile from "./pages/Profile.js"
import Post from "./pages/Post.js"
import Home from './pages/Home.js';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: "/user/:username", element: <Profile /> },
  { path: "/post/:postid", element: <Post /> }]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SearchProvider>
      <App />
      <RouterProvider router={router} />
    </SearchProvider>
  </React.StrictMode>
);