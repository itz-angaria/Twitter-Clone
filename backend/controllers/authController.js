const User = require('../models/User.js');
const { hashPassword, matchPassword } = require('../utilities/auth-utils.js');
const jwt = require('jsonwebtoken');

// Regular expression pattern for email validation
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Registration function
const register = async (req, res) => {
    try {
        // Extract user information from request body
        const { name, email, password, username } = req.body;

        // Check if the email is valid
        if (!emailPattern.test(email)) {
            return res.json({ error: 'Please enter a valid email' });
        }

        // Check if any required field is missing
        if (!name || !email || !password || !username) {
            return res.json({ error: 'One or more values are missing.' });
        }

        // Check if user already exists with the provided email or username
        const alreadyExistingUser = await User.findOne({ email });
        const alreadyExistingUserName = await User.findOne({ username });

        if (alreadyExistingUser) {
            return res.json({ error: 'User already present with this email' });
        }

        if (alreadyExistingUserName) {
            return res.json({ error: 'User already present with this username' });
        }

        // Hash the user's password and create a new user
        const hashedPassword = await hashPassword(password);
        const user = await new User({ name, email, password: hashedPassword, username }).save();

        // Create a JSON Web Token (JWT) for user authentication
        const token = jwt.sign({ _id: user._id }, "" + process.env.JWT_SECRET, { expiresIn: '2d' });

        // Send user data and token as a response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token
        });
    } catch (error) {
        // Handle errors during registration
        console.log(error);
        res.json({ error: 'An error occurred during registration' });
    }
};

// Login function
const login = async (req, res) => {
    try {
        // Extract login credentials from request body
        const { email, password } = req.body;

        // Validate the email format
        if (!emailPattern.test(email)) {
            return res.json({ error: 'Please enter a valid email' });
        }

        // Check if any required field is missing
        if (!email || !password) {
            return res.json({ error: 'One or more values are missing.' });
        }

        // Find the user with the provided email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.json({ error: 'User not found' });
        }

        // Compare the provided password with the user's stored password
        const isMatch = await matchPassword(password, user.password);

        if (!isMatch) {
            return res.json({ error: 'Wrong Password' });
        }

        // Create a new JWT for user authentication
        const token = jwt.sign({ _id: user._id, name: user.name }, "" + process.env.JWT_SECRET, { expiresIn: '10d' });

        // Send user data and token as a response
        res.status(200).json({
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                joiningDate: user.createdAt,
                username: user.username,
                following: user?.following,
                followers: user?.followers
            },
            token
        });
    } catch (error) {
        // Handle errors during login
        res.json({ error: 'An error occurred during login' });
    }
};

// Export the registration and login functions
module.exports = { register, login };
