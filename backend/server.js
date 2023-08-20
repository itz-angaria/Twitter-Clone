const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { MONGODB_URL } = require('./config');
const authRoutes = require('./routes/auth.js');
const tweetRoutes = require('./routes/tweet.js');
const userRoutes = require('./routes/user.js');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

// Connect to MongoDB database (Replace the connection string with your MongoDB URL)
mongoose.connect(MONGODB_URL);
mongoose.connection.on('connected', () => {
  console.log("DB connected");
});
mongoose.connection.on('error', (error) => {
  console.log("some error");
});

// Enable JSON body parsing
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/tweet', tweetRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
