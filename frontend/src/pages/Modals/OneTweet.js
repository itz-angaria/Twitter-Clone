import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTweetData } from '../../Datacontext/TweetData';
import CreateCommentModal from './Comment';
import '../Modals/OneTweet.css';

const OneTweet = () => {
  // Get data from the TweetData context
  const { auth, setTweetToAddACommentOn, tweetToAddACommentOn, sendRequestToBackendToReTweeet } = useTweetData();

  // States
  const [singleTweet, setSingleTweet] = useState();
  const [reloadSingleTweet, setReloadSingleTweet] = useState(false);

  // Get tweet ID from URL parameters
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const date = moment(singleTweet?.createdAt).fromNow();

  // Function to send a like request to the backend
  const sendLikeRequest = async (id) => {
    const { data } = await axios.put(`/tweet/likeTweet/${id}`);
    // ...
  };

  // Function to send a delete request to the backend
  const sendDeleteRequestToBackend = async (id) => {
    const { data } = await axios.delete(`/tweet/deleteTweet/${id}`);
    // ...
  };

  // Function to navigate and show a single tweet
  const showSingleTweet = (id) => {
    navigate(`/tweet/${id}`);
    getSingleTweetDetails();
  };

  // Function to fetch details of the tweet to comment on
  const fetchDetailsOfTweetToCommentOn = async (IDOftweetToCommentOn) => {
    setTweetToAddACommentOn(IDOftweetToCommentOn);
    // ...
  };

  // Function to get details of a single tweet
  const getSingleTweetDetails = async () => {
    const { data } = await axios.get(`/tweet/getSingleTweet/${id}`);
    if (data?.singleTweet) {
      setSingleTweet(data?.singleTweet);
    }
  };

  // Fetch single tweet details when the component mounts or when dependencies change
  if (!singleTweet) {
    getSingleTweetDetails();
  }

  useEffect(() => {
    getSingleTweetDetails();
  }, [id, tweetToAddACommentOn, reloadSingleTweet]);

  // Render when there is no single tweet
  if (!singleTweet) {
    return <h1 style={{ marginTop: '4rem' }}> No tweets To Show</h1>;
  }

  return (
    <div>
      {/* Content of single tweet */}
      <div class="single-feed" style={{ marginTop: '6.6rem', minWidth: '45rem' }}>
        {/* Display single tweet content here */}
      </div>

      {/* Modal for adding a comment */}
      <CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet} />
    </div>
  );
};

export default OneTweet;
