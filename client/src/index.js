import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import Login from'./routes/login';
import Register from'./routes/Register';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './routes/Dual/Dashboard';
import CreatePost from './routes/Dual/Create-post';
import Profile from './routes/Dual/Profile';
import PostDetails from './routes/Dual/PostDetails';
import ApplicationForm from './routes/AmbassadorRoutes/ApplicationForm';
import Applications from './routes/CompanyRoutes/Applications';
import ApplicationDetails from './routes/CompanyRoutes/ApplicationDetails';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "create-post",
    element: <CreatePost />,
  },  
  {
    path: "profile/:userId",
    element: <Profile />,
  },
  {
    path: "post/:postId",
    element: <PostDetails />,
  },
  {
    path: "apply/:postId",
    element: <ApplicationForm />,
  },
  {
    path: "Applications/:postId",
    element: <Applications />,
  },
  {
    path: "ApplicationDetails/:applicationId",
    element: <ApplicationDetails />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
