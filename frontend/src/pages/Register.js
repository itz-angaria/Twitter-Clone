import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Datacontext/AuthData';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import '../pages/css/Register.css';

// Initial object for storing register details
const registerObject = {
  name: '',
  username: '',
  email: '',
  password: '',
};

const Register = () => {
  // State to store register details
  const [registerDetails, setRegisterDetails] = useState(registerObject);
  // State to manage authentication details
  const [auth, setAuth] = useAuth();
  // Hook to manage navigation
  const navigate = useNavigate();

  // Function to handle input changes and update state
  const handleChange = (e) => {
    setRegisterDetails({ ...registerDetails, [e.target.name]: e.target.value });
    console.log(registerDetails);
  };

  // Function to send registration request to the backend
  const sendRequestToBackendToRegisterRoute = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/auth/register', registerDetails);
      // Store auth data in local storage
      localStorage.setItem('auth', JSON.stringify(data));
      // Update the auth state with received data
      setAuth({
        ...auth,
        token: data?.token,
        user: data?.user,
      });
      // Display success toast
      toast.success('Registration Successful! Please Login');
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      // Display error toast with a specific message or a generic message if no error message is available
      toast.error(error?.response?.data?.error || 'An error occurred while registering.');
    }
  };

  return (
    <div className="container shadow" id="container">
      <div className="form-container register-container">
        <form>
          <h1 className="form-heading mt-4 mb-0">Register</h1>
          <input type="name" onChange={handleChange} name="name" placeholder="Full Name" />
          <input type="email" onChange={handleChange} name="email" placeholder="Email" />
          <input type="username" onChange={handleChange} name="username" placeholder="Username" />
          <input type="password" onChange={handleChange} name="password" placeholder="Password" />
          <button type="button" onClick={sendRequestToBackendToRegisterRoute}>Register</button>
          <h5 className='text-muted text-center mt-0 '>OR</h5>
          <hr className='text-muted hh mt-0'/>
          <p className='text mt-0 fs-6'>
            Already Registered? <NavLink to="/login">Login here</NavLink>
          </p>
        </form>
      </div>
      <div className="container-overlay">
        <div className="overlay">
          <div className="overlay-panel overlay-right">
            <h2 className="mb-1">Join Us</h2>
            <i className="fa-regular iconStyle fa-comment-dots" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
