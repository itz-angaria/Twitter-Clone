import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Datacontext/AuthData';
import { useTweetData } from '../Datacontext/TweetData';
import './css/Login.css';

const Login = () => {
	// State to store login form details
	const [loginDetails, setLoginDetails] = useState({
		email: '',
		password: '',
	});

	// Get authentication state and set authentication
	const [auth, setAuth] = useAuth();
	const navigate = useNavigate();
	const { getAllTweets } = useTweetData();

	// Update state when user types in input fields
	const handleChange = (e) => {
		const { name, value } = e.target;
		setLoginDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};

	// Send login request to backend on button click
	const sendLoginRequestToTheBackend = async (e) => {
		e.preventDefault();
		try {
			// Make POST request to login endpoint
			const { data } = await axios.post('http://localhost:5000/auth/login', loginDetails);

			if (data?.error) {
				// Display error message using toast if login fails
				toast.error(data?.error);
			} else {
				// Save authentication data and user details
				localStorage.setItem('auth', JSON.stringify(data));
				setAuth({
					...auth,
					token: data?.token,
					user: data?.user,
				});
				// Fetch user's tweets, display success message, and navigate to home page
				getAllTweets();
				toast.success('User Logged In Successfully');
				navigate('/');
			}
		} catch (error) {
			// Log and display error if request fails
			console.error('Error logging in:', error);
		}
	};

	return (
		<div className="container shadow" id="container">
			<ToastContainer />
			<div className="form-container log-in-container">
				<form className='login'>
					<h1 className="form-heading login-heading">Log in</h1>
					<input type="email" onChange={handleChange} name="email" placeholder="Enter your Email" />
					<input type="password" onChange={handleChange} name="password" placeholder="Password" />
					<button type="button" onClick={sendLoginRequestToTheBackend}>Login</button>
					<h5 className='text-muted text-center mt-0'>OR</h5>
					<hr className='text-muted hh mt-0' />
					<p className='text fs-6 mt-0'>
						Don't have an account? <NavLink to="/register">Register here</NavLink>
					</p>
				</form>
			</div>
			<div className="overlay-container">
				<div className="overlay">
					<div className="overlay-panel overlay-right welcome-back">
					<h2>Welcome Back</h2>
					<i className="fa-regular iconStyle fa-comment-dots" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
