import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Datacontext/AuthData';
import { useTweetData } from '../Datacontext/TweetData';
import './Resources/Layout.css';
import EditProfileModal from './Modals/EditProfile';
import './css/Home.css';
import CreateCommentModal from './Modals/Comment';
import EditProfileDetailsModal from './Modals/EditDetail';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Profile = () => {
  const { authDetails, getSingleUserDetails, singleUserPageDetails, showSingleTweet, sendDeleteRequestToBackend, sendLikeRequest, fetchDetailsOfTweetToCommentOn, sendRequestToBackendToReTweeet, allTweets } = useTweetData();
  const [auth, setAuth] = useAuth();
  const [loggedInUser, setLoggedInUser] = useState();
  const [reloadSingleTweet, setReloadSingleTweet] = useState(false);
  const [renderBool, setRenderBool] = useState(false);

  console.log(authDetails, 'from profile js');
  console.log(singleUserPageDetails);

  const fetchSingleUserDetails = async (id) => {
    const { data } = await axios.get(`/user/getSingleUser/${id}`);
    if (data?.user) {
      setLoggedInUser(data?.user);
    }
  };

  const fetchUserDetails = async (userId) => {
    navigate(`/profile/${userId}`);
  };

  const navigate = useNavigate();

  if (!loggedInUser) {
    fetchSingleUserDetails(auth?.user?.userId);
  }

  useEffect(() => {
    getSingleUserDetails();
    setRenderBool((prev) => !prev); // Force re-render by toggling the state
  }, [allTweets, loggedInUser]);

  console.log(loggedInUser, 'profile page single user');
  const date = new Date(auth?.user?.joiningDate);

  return (
    <div class="profile">
      {/* Profile Header */}
      <div class="feed-header d-flex justify-content-between align-items-center">
        <h2>Profile</h2>
      </div>

      {/* Profile Details */}
      <div class="profile-details border border-white">
        {/* Profile Information */}
        <div class="profile-followbtn d-flex justify-content-between align-items-center">
          <div class="profile-information">
            <center>
              <div class="profile-information-img">
                <img src={loggedInUser?.profile_picture ? loggedInUser?.profile_picture : require('../images/DP.webp')} style={{border: '2px solid black', marginLeft: -20}} alt="DP" />
              </div>
            </center>
            <div class="profile-name">
              <h2>{auth?.user?.name}</h2>
              <span>@{auth?.user?.username}</span>
            </div>
            <div class="profile-username"></div>
          </div>

          {/* Update Profile Photo Button */}
          <button type="button" class="btn btn-dark user-profile-photo-upload" data-bs-toggle="modal" data-bs-target="#exampleModal3">
            <span>Update Profile Photo</span>
          </button>

          {/* Edit Profile Button */}
          <button type="button" class="btn btn-dark user-profile-edit" data-bs-toggle="modal" data-bs-target="#exampleModal4">
            <span>Edit</span>
          </button>
        </div>

        {/* Other Details */}
        <div class="other-details">
          <div class="birthday-location d-flex">
            <div class="birthday">
              <i class="fa-solid fa-cake-candles" style={{color: "orange"}}></i>
              <span>Date Of Birth:</span>
              <span id="dob">{new Date(auth?.user?.DateOfBirth).toDateString()}</span>
            </div>
            <div class="location">
              <i class="fa-solid fa-location-dot"  style={{color: "skyblue"}}></i>
              <span>Location:</span>
              <span id="location">{auth?.user?.location || loggedInUser?.location}</span>
            </div>
          </div>
          <div class="joining-date">
            <i class="fa-regular fa-calendar" style={{color: "blue"}}></i>
            <span>Joined:</span>
            <span id="joining">{date.toDateString()}</span>
          </div>
        </div>

        {/* Followers and Following */}
        <div class="followers-n-following d-flex">
          <div class="following">
            <span id="Following">{loggedInUser?.following?.length}</span>
            <span style={{fontWeight: 'bold'}}>Following</span>
          </div>
          <div class="followers">
            <span id="Followers">{loggedInUser?.followers?.length}</span>
            <span style={{fontWeight: 'bold'}}>Followers</span>
          </div>
        </div>

        {/* Heading for Tweets and Replies */}
        <div class="heading-tweet-profile">
          <center>
            <h4>Tweets and Replies</h4>
          </center>
        </div>

        {/* Display User Tweets and Replies */}
        {singleUserPageDetails &&
          singleUserPageDetails?.tweets?.map((tweet) => (
            <div class="single-feed" key={tweet._id}>
              {/* Tweet Header */}
              <div class="tweet-header d-flex">
                <div class="user-profile-img-container">
                  {loggedInUser?.profile_picture ? <img src={loggedInUser?.profile_picture} alt="" /> : <img src={require('../images/DP.webp')} alt="" />}
                </div>

                <div class="username-container">
                  <span onClick={() => fetchUserDetails(auth?.user?.userId)} class="username">
                    @{tweet?.tweetedBy?.username} -
                  </span>
                </div>
                <div class="date-container">
                  <span class="date">{moment(tweet?.createdAt).fromNow()}</span>
                </div>

                {/* Delete Icon for User's Own Tweets */}
                {auth?.user?.userId === tweet?.tweetedBy?._id && (
                  <div class="delete-icon-container" onClick={() => sendDeleteRequestToBackend(tweet._id)}>
                    <i class="fa-solid fa-trash-can fa-shake" style={{color: 'red'}}></i>
                  </div>
                )}
              </div>

              {/* Tweet Text */}
              <div class="single-tweet-text">
                <span>{tweet?.content}</span>
              </div>

              {/* Tweet Image */}
              {tweet?.image && <div class="single-tweet-img-container">
                <img src={tweet?.image} alt="" />
              </div>}

              {/* Tweet Operations */}
              <div class="tweet-operations d-flex gap-4">
                {/* Like Icon and Count */}
                <div class="like-icon-container" onClick={() => sendLikeRequest(tweet._id)}>
                  <i
                    class={`${
                      tweet.likes.map((singleLike) => {
                        if (singleLike.user === auth?.user?.userId) {
                          return 'fa-heart fa-solid';
                        } else {
                          return 'fa-heart fa-regular';
                        }
                      })} ${tweet?.likes?.length === 0 && 'fa-regular fa-heart'}`}
                   style={{color: 'red'}}></i>
                  <span>{tweet?.likes?.length}</span>
                </div>

                {/* Comment Icon and Count */}
                <div class="comment-icon-container" onClick={() => fetchDetailsOfTweetToCommentOn(tweet._id)}>
                  <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                    <i class="fa-regular fa-comment" ></i>
                    <span>{tweet?.replies?.length}</span>
                  </a>
                </div>

                {/* Retweet Icon and Count */}
                <div class="retweet-icon-container" onClick={() => sendRequestToBackendToReTweeet(tweet._id)}>
                  <i class="fa-solid fa-retweet" style={{color: 'yellowgreen'}}></i>
                  <span>{tweet?.reTweetedBy?.length}</span>
                </div>
              </div>
            </div>
          ))}

        {/* Display message when there are no tweets */}
        {singleUserPageDetails?.tweets?.length === 0 && <h1 style={{ textAlign: 'center', border: '1px solid black' }}>No Tweets & Replies To Show</h1>}
      </div>

      {/* Modal Components */}
      <EditProfileModal />
      <CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet} />
      <EditProfileDetailsModal currentUser={auth} />
    </div>
  );
};

export default Profile;
