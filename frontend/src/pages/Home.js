import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../Datacontext/AuthData';
import { useTweetData } from '../Datacontext/TweetData';
import CreateCommentModal from './Modals/Comment';
import CreateTweetModal from './Modals/Tweet';
import moment from 'moment';
import axios from 'axios';
import '../pages/css/Home.css';

const Home = () => {
    // State and hooks
    const [auth, setAuth] = useAuth();
    const { setTweetToAddACommentOn, tweetToAddACommentOn } = useTweetData();
    const [showAllTweets, setShowAllTweets] = useState(true);
    const [reloadSingleTweet, setReloadSingleTweet] = useState(false);
    const ref = useRef(null);
    const { tweetBool, setTweetBool, allTweets, getAllTweets, tweetsFromFollowingUsers } = useTweetData();

    // Function to scroll to the top of the feed
    const scrollToTop = () => {
        ref.current.scroll({
            top: 0,
        });
    };

    // Extracting tweet IDs of users that the current user is following
    const followingTweetIds = tweetsFromFollowingUsers?.map((tweet) => {
        return tweet?.tweetedBy?._id;
    });

    // React Router hook for navigation
    const navigate = useNavigate();

    // Function to create a retweet
    const sendRequestToBackendToReTweeet = async (id) => {
        const { data } = await axios.post(`/tweet/createReTweet/${id}`);
        console.log(data);
        if (data?.error) {
            toast.error(data?.error);
        } else if (data?.createNewTweetAsRetweet) {
            toast.success('retweeted Successfully');
        }
        getAllTweets();
    };

    // Function to delete a tweet
    const sendDeleteRequestToBackend = async (id) => {
        const { data } = await axios.delete(`/tweet/deleteTweet/${id}`);
        if (data?.error) {
            toast.error(data?.error);
        } else {
            if (data?.deletedReplies) {
                toast.success(`Tweet deleted successfully along with ${data?.deletedReplies} nested reply(ies)`);
            }
            toast.success('Tweet Deleted Successfully');
            getAllTweets();
        }
    };

    // Function to show a single tweet
    const showSingleTweet = (id) => {
        navigate(`/tweet/${id}`);
    };

    // Function to fetch details of a tweet to comment on
    const fetchDetailsOfTweetToCommentOn = async (IDOftweetToCommentOn) => {
        setTweetToAddACommentOn(IDOftweetToCommentOn);
        const { data } = await axios.get(`/tweet/getSingleTweet/${IDOftweetToCommentOn}`);
    };

    // Function to fetch user details
    const fetchUserDetails = async (userId) => {
        navigate(`/profile/${userId}`);
    };

    // Function to send a like request for a tweet
    const sendLikeRequest = async (id) => {
        const { data } = await axios.put(`/tweet/likeTweet/${id}`);
        if (data?.error) {
            toast.error(data?.error);
        } else {
            if (data?.like) {
                toast.info('Tweet Liked Successfully');
            }
            if (!data?.like) {
                toast.info('Tweet Unliked Successfully');
            }
            getAllTweets();
        }
    };

    // Fetch all tweets on component mount
    useEffect(() => {
        getAllTweets();
    }, []);

    // JSX rendering
    return (
        <>
            <div className="feed " ref={ref} style={{ minWidth: '40rem' }}>
                {/* Feed header */}
                <div className="feed-header d-flex justify-content-between align-items-center">
                    <h2>Home</h2>
                    <button type="button" className="btn btn-primary tweet-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Tweet
                    </button>
                </div>
                {/* Display message when there are no tweets */}
                {allTweets.length === 0 && <h1 style={{ textAlign: 'center' }}>No Tweets</h1>}
                {/* Display all tweets */}
                {allTweets &&
                    allTweets.map((singleTweet, index) => {
                        if (singleTweet?.isAReply) {
                            return null;
                        }
                        return (
                            <div className="single-feed">
                                {/* Show retweet information if it is a retweet */}
                                {singleTweet?.isARetweet && <p style={{ color: 'blue', fontStyle: 'italic' }}>ReTweeted By: @{singleTweet?.thisTweetIsRetweetedBy?.username}</p>}
                                <div className="tweet-header d-flex">
                                    <div className="user-profile-img-container">
                                        {singleTweet?.tweetedBy?.profile_picture ? (
                                            <img src={singleTweet?.tweetedBy?.profile_picture} style={{ width: '100%' }} alt="" />
                                        ) : (
                                            <img src={require('../images/DP.webp')} alt="" />
                                        )}
                                    </div>
                                    <div className="username-container" onClick={() => fetchUserDetails(singleTweet?.tweetedBy._id)}>
                                        <span className="username">@{singleTweet?.tweetedBy?.username}</span>
                                    </div>
                                    <div className="date-container">
                                        <span className="date">{moment(singleTweet?.createdAt).fromNow()}</span>
                                    </div>
                                    <div
                                        className="delete-icon-container d-flex justify-content-between align-items-center"
                                        style={{ marginRight: '2rem', width: '5rem' }}
                                    >
                                        {/* Show delete icon if the tweet was created by the current user */}
                                        {singleTweet?.thisTweetIsRetweetedBy?._id === auth?.user?.userId && (
                                            <i onClick={() => sendDeleteRequestToBackend(singleTweet._id)} className="fa-solid fa-trash-can fa-shake" style={{color: 'red', marginLeft: 70}}></i>
                                        )}
                                        {auth?.user?.userId === singleTweet?.tweetedBy?._id && !singleTweet?.isARetweet && (
                                            <i onClick={() => sendDeleteRequestToBackend(singleTweet._id)} className="fa-solid fa-trash-can fa-shake" style={{color: 'red', marginLeft: 70}}></i>
                                        )}
                                    </div>
                                </div>
                                <div className="single-tweet-text">
                                    <span>{singleTweet.content}</span>
                                </div>
                                {/* Show tweet image if it exists */}
                                {singleTweet?.image ? (
                                    <div className="single-tweet-img-container">
                                        <img src={singleTweet?.image} alt="" />
                                    </div>
                                ) : null}
                                <div className="tweet-operations  d-flex gap-4">
                                    <div className="like-icon-container" onClick={() => sendLikeRequest(singleTweet._id)}>
                                        <a>
                                            <i
                                                className={`${
                                                    singleTweet.likes.map((singleLike) => {
                                                        if (singleLike.user === auth?.user?.userId) {
                                                            return 'fa-heart fa-solid';
    
                                                        } else {
                                                            return 'fa-heart fa-regular';
                                                        }
                                                    })
                                                } ${singleTweet?.likes?.length === 0 && 'fa-regular fa-heart'}`}
                                            style={{color: 'red'}}></i>
                                            <span>{singleTweet?.likes?.length}</span>
                                        </a>
                                    </div>
                                    <div className="comment-icon-container" onClick={() => fetchDetailsOfTweetToCommentOn(singleTweet._id)}>
                                        <a data-bs-toggle="modal" data-bs-target="#exampleModal2">
                                            <i className="fa-regular fa-comment" style={{color: '#50b7f5'}}></i>
                                            <span>{singleTweet?.replies?.length}</span>
                                        </a>
                                    </div>
                                    <div className="retweet-icon-container" onClick={() => sendRequestToBackendToReTweeet(singleTweet._id)}>
                                        <i className="fa-solid fa-retweet" style={{color: 'yellowgreen'}}></i>
                                        <span>{singleTweet?.reTweetedBy?.length}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            {/* Modals */}
            <CreateTweetModal />
            <CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet} />
        </>
    );
};

export default Home;
