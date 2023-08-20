const express = require('express');
const { createTweet, getAllTweets, deleteTweet, likeTweet, followUser, reTweet, uploadImageToCloud, getSingleTweet, createComment, getAllTweetsFromFollowingUsers, createComment2, createReTweet } = require('../controllers/tweetController');
const { followUserController } = require('../controllers/userController');
const { isUserAuthenticated } = require('../middleware/auth');
const {uploadImage, upload} = require('../middleware/tweet');
const { tweetPhotoUpload, afterUploadingThroughMulter } = require('../utilities/tweetPhotoUpload');

const router = express.Router();

// Route to upload picture to cloud storage
router.post('/uploadPictureToCloud', tweetPhotoUpload.single('file'), afterUploadingThroughMulter, uploadImageToCloud);

// Route to create a new tweet
router.post('/createTweet', isUserAuthenticated, createTweet);

// Route to get details of a single tweet
router.get('/getSingleTweet/:id', isUserAuthenticated, getSingleTweet);

// Route to get all tweets from following users
router.post('/getAllTweets', isUserAuthenticated, getAllTweetsFromFollowingUsers);

// Route to get all tweets
router.get('/getAllTweets', isUserAuthenticated, getAllTweets);

// Route to create a comment on a tweet
router.post('/createComment/:tweetId', isUserAuthenticated, createComment);

// Route to create a nested comment with replies on a tweet
router.put('/createComment/:tweetId', isUserAuthenticated, createComment2);

// Route to create a retweet
router.post('/createRetweet/:tweetId', isUserAuthenticated, createReTweet);

// Route to follow a user
router.post('/follow/:follower/:toFollow', isUserAuthenticated, followUserController);

// Route to like a tweet
router.put('/likeTweet/:tweetId', isUserAuthenticated, likeTweet);

// Route to delete a tweet
router.delete('/deleteTweet/:id', isUserAuthenticated, deleteTweet);

module.exports = router;
