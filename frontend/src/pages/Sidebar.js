import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Large from '../components/Container-lg';
import './css/Sidebar.css';
import { useAuth } from '../Datacontext/AuthData';
import { useTweetData } from '../Datacontext/TweetData';
import DP from '../images/DP.webp';

const Sidebar = () => {
  // Get auth state and setter from context
  const [auth, setAuth] = useAuth();
  const { setAuthDetails } = useTweetData();

  // Hook to manage navigation
  const navigate = useNavigate();

  // Function to handle logout
  const logOut = () => {
    // Clear auth state and local storage
    setAuth({ ...auth, user: null, token: '' });
    setAuthDetails({ ...auth, user: null, token: '' });
    localStorage.removeItem('auth');

    // Navigate to login page after logout
    navigate('/login');
  };

  return (
    // Use Large component for styling and layout
    <Large>
      <div className="sidebar">
        <i className="fa-solid fa-message fa-shake"></i>
        {/* Home Option */}
        <div className="sidebarOption active">
          <span className="material-symbols-outlined">Home</span>
          {/* Link to Home page */}
          <NavLink to="/">
            <h2 style={{color: 'black'}}>Home</h2>
          </NavLink>
        </div>
        {/* Profile Option */}
        <div className="sidebarOption">
          <span className="material-symbols-outlined">person</span>
          {/* Link to Profile page */}
          <NavLink to="/profile">
            <h2 style={{color: 'black'}}>Profile</h2>
          </NavLink>
        </div>
        {/* Logout Option */}
        <div className="sidebarOption">
          <span className="material-symbols-outlined">logout</span>
          {/* Logout link with click event */}
          <a onClick={logOut}>
            <h2 style={{color: 'black'}}>Logout</h2>
          </a>
        </div>
        {/* User Info */}
        <div className="sidebarOption2 justify-content-center gap-2 last-sidebar-item">
          <div className="img-container">
            {/* Display user profile picture */}
            <img src={DP} alt="DP" />
          </div>
          <div className="name-n-username-container">
            {/* Display user name */}
            <h2>{auth?.user?.name}</h2>
            <div className="username-container">
              {/* Display user username */}
              <span>@{auth?.user?.username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render the child components */}
      <Outlet />
    </Large>
  );
};

export default Sidebar;
