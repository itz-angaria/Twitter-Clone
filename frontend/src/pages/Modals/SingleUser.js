import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTweetData } from '../../Datacontext/TweetData';
import CreateCommentModal from './Comment';
import DP from '../../images/DP.webp';
import '../Modals/Singleuser.css';

const SingleUser = () => {
  const [singleUser, setSingleUser] = useState();
  const {
    getSingleUserDetails,
    showSingleTweet,
    fetchDetailsOfTweetToCommentOn,
    sendRequestToBackendToReTweeet,
    sendDeleteRequestToBackend,
    getTweetsFromFollowingUsers,
    auth,
    getAllTweets,
    sendLikeRequest,
    allTweets,
  } = useTweetData();

  const [reloadSingleTweet, setReloadSingleTweet] = useState(false);
  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  // Function to fetch single user details
  const fetchSingleUserDetails = async (id) => {
    try {
      const { data } = await axios.get(`/user/getSingleUser/${id}`);
      if (data) {
        setSingleUser(data);
        console.log(data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch single user details on component mount and when allTweets changes
  useEffect(() => {
    fetchSingleUserDetails(id);
    getSingleUserDetails();
  }, [allTweets]);

  // Check if the current user is viewing their own page and navigate to the profile page if so
  useEffect(() => {
    if (id === auth?.user?.userId) {
      navigate('/profile');
    }
  }, [id]);

  // Function to handle follow/unfollow button click
  const sendFollowRequestToTheBackend = async (follower, userToFollow) => {
    if (follower === userToFollow) {
      toast.error('Oops! You cannot follow yourself');
      return;
    }

    try {
      const { data } = await axios.post(`/tweet/follow/${follower}/${userToFollow}`);
      fetchSingleUserDetails(id);

      if (data?.userToUnfollow) {
        toast.success('User unfollowed successfully');
      }
      if (data?.userToFollow) {
        toast.success('User followed successfully');
      }
    } catch (error) {
      console.error('Error sending follow request:', error);
    }
  };

  return (
    <div className="profile">
      <div className="feed-header d-flex justify-content-between align-items-center">
        <h2>Profile</h2>
      </div>

      <div className="profile-details border border-white">
        {/* Profile Info */}
        <div className="profile-followbtn d-flex justify-content-between align-items-center">
          <div className="profile-information">
            <center>
              <div style={{ maxWidth: '12rem' }}>
                {singleUser?.user?.profile_picture ? (
                  <img
                    style={{ borderRadius: '50%', objectFit: 'contain', width: '100%' }}
                    src={singleUser?.user?.profile_picture}
                    alt=""
                  />
                ) : (
                  <img style={{ borderRadius: '50%' }} src={DP} alt="" />
                )}
              </div>
            </center>
            <div className="profile-name">
              <h2>{singleUser?.user?.name}</h2>
              <span>@{singleUser?.user?.username}</span>
            </div>
            <div className="profile-username"></div>
          </div>
          {/* Follow/Unfollow Button */}
          <button
            type="button"
            onClick={() => sendFollowRequestToTheBackend(auth?.user?.userId, params.id)}
            className="btn btn-dark followunfollowbtn"
          >
            <span>
              {/* Display 'Follow' or 'Unfollow' based on whether the current user is following the single user */}
              {singleUser?.user?.followers.find(({ user }) => user === auth?.user?.userId)
                ? 'Unfollow'
                : 'Follow'}
            </span>
          </button>
        </div>

        {/* Other details */}
        <div className="other-details">
          <div className="birthday-location d-flex">
            <div className="birthday">
              <i className="fa-solid fa-cake-candles" style={{color: 'orange'}}></i>
              <span>Dob:</span>
              <span id="dob">Tue May 04 1996</span>
            </div>
            <div className="location">
              <i className="fa-solid fa-location-dot" style={{color: 'skyblue'}}></i>
              <span>Location:</span>
              <span id="location">Himachal Pradesh</span>
            </div>
          </div>
          <div className="joining-date">
            <i className="fa-regular fa-calendar"style={{color: 'blue'}}></i>
            <span>Joined:</span>
            <span id="joining">Tue Jul 04 2023</span>
          </div>
        </div>

        {/* Followers and Following */}
        <div className="followersandfollowing d-flex">
          <div className="following">
            <span id="Following">{singleUser?.user?.following.length}</span>
            <span> Following</span>
          </div>
          <div className="followers">
            <span id="Followers">{singleUser?.user?.followers.length}</span>
            <span>Followers</span>
          </div>
        </div>

        {/* Heading for Tweets and Replies */}
        <div className="headingoftweetsprofiloe">
          <center>
            <h4>Tweets and Replies</h4>
          </center>
        </div>

        {/* Display Single User's Tweets */}
        {singleUser?.tweetsByThisUser &&
          singleUser?.tweetsByThisUser.map((singleTweet) => (
            <div className="single-feed" key={singleTweet._id}>
              <div className="tweet-header d-flex ">
                <div className="user-profile-img-container">
                  {singleUser?.user?.profile_picture ? (
                    <img src={singleUser?.user?.profile_picture} alt="" />
                  ) : (
                    <img src={DP} alt="" />
                  )}
                </div>

                <div className="username-container">
                  <span className="username">@{singleUser?.user?.username}</span>
                </div>
                <div className="date-container">
                  <span className="date">{moment(singleTweet?.createdAt).fromNow()}</span>
                </div>

                {/* Display delete icon if the current user owns the tweet */}
                {auth?.user?.userId === singleUser?.user?._id && (
                  <div className="delete-icon-container" onClick={() => sendDeleteRequestToBackend(singleTweet?._id)}>
                    <i className="fa-solid fa-trash-can"></i>
                  </div>
                )}
              </div>
              <div className="single-tweet-text">
                <span>{singleTweet?.content}</span>
              </div>

              {/* Display image if available */}
              {singleTweet?.image && (
                <div className="single-tweet-img-container">
                  <img src={singleTweet?.image} alt="Tweet" />
                </div>
              )}
              <div className="tweet-operations d-flex gap-4">
                <div className="like-icon-container" onClick={() => sendLikeRequest(singleTweet?._id)}>
                  <i
                    className={`${
                      singleTweet.likes.map((singleLike) => {
                        if (singleLike.user === auth?.user?.userId) {
                          return 'fa-heart fa-solid'; // When the current user has liked a certain post show a solid heart
                        } else {
                          return 'fa-heart fa-regular';
                        }
                      }) // When likes are zero, return a regular heart
                    } ${singleTweet?.likes?.length === 0 && 'fa-regular fa-heart'}`}
                  ></i>
                  <span>{singleTweet.likes.length}</span>
                </div>
                <div className="comment-icon-container" onClick={() => fetchDetailsOfTweetToCommentOn(singleTweet._id)}>
                  <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                    <i className="fa-regular fa-comment"></i>
                    <span>{singleTweet.comments.length}</span>
                  </a>
                </div>

                <div className="retweet-icon-container" onClick={() => sendRequestToBackendToReTweeet(singleTweet?._id)}>
                  <i className="fa-solid fa-retweet"></i>
                  <span>{singleTweet.reTweetedBy.length}</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal for comments */}
      <CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet} />
    </div>
  );
};

export default SingleUser;
