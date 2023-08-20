import axios from 'axios'

import { useState, createContext, useContext, useEffect } from 'react'
import { useNavigate,Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from './AuthData';
import  { getLoggedInUser, getFollowersTweet } from './getFollowersTweet';

const TweetData = createContext();


const TweetProvider = ({ children }) => {
    
    const navigate = useNavigate()
    const [allTweets, setAllTweets] = useState([]);
    const [auth, setAuth] = useAuth();
    // ! to store the tweets & replies from the single user page
    const [singleUserPageDetails,setSingleUserPageDetails] = useState()
    const [followersTweet,setFollowersTweet] = useState([])
    const [authDetails,setAuthDetails] = useState()
    
    const [tweetBool, setTweetBool] = useState(false);
    const [tweetToAddACommentOn,setTweetToAddACommentOn] = useState(null)


    
    
// ! this sendLikeRequest function is being used by Profile.js & also SingleUser.js
    const sendLikeRequest = async(tweetToLike)=>{
        const {data} = await axios.put(`/tweet/likeTweet/${tweetToLike}`)
        if(data?.error){
            toast.error(data?.error)
        }else{
            // ! i am sending a boolean from the backend
            if(data?.like){

                toast.info("Tweet Liked Successfully")
            }
            // ! when like is true it means tweet was unliked
            if(!data?.like){
                toast.info("Tweet Unliked Successfully")

            }
            getSingleUserDetails()
            getAllTweets()
        }
    }

    const sendDeleteRequestToBackend = async(id)=>{
        // ! delete request
        const {data} = await axios.delete(`/tweet/deleteTweet/${id}`)
        
        if(data?.error){
            toast.error(data?.error)
        }else{
            if(data?.deletedReplies){
                toast.success(`Tweet deleted successfully along with ${data?.deletedReplies} nested reply(ies)`)
            }
            toast.success('Tweet Deleted Successfully');
            // ! load all tweets after the certain
            getAllTweets();
        }
     
    }
    const showSingleTweet = (id)=>{
    
        navigate(`/tweet/${id}`);
    }

    // ! globally defining this in TweetData so that Profile & SingleUser can access it
    

    const fetchDetailsOfTweetToCommentOn = async(IDOftweetToCommentOn)=>{
        setTweetToAddACommentOn(IDOftweetToCommentOn)
        const {data} = await axios.get(`/tweet/getSingleTweet/${IDOftweetToCommentOn}`)  
    }
   

    const sendRequestToBackendToReTweeet=async(id)=>{
        const {data} = await axios.post(`/tweet/createReTweet/${id}`)
        console.log(data)
        if(data?.error){
            toast.error(data?.error)
        }
        else{
            toast.success('retweeted Successfully')
            
            navigate('/')
        }
        
    it
        getAllTweets()

    }
   
    

    async function getLoggedInDetails(){

        const loggedInUser = await getLoggedInUser();
        //console.log(loggedInUser)
        const following = await getFollowersTweet(loggedInUser);

        //console.log(following)
        setFollowersTweet(following?.tweets)
        
        return loggedInUser;
    }

    const getSingleUserDetails = async()=>{
        const {data} = await axios.get(`/user/getSingleUser`);
        if(data?.error){
            toast?.error(data?.error)
        }else{
            setSingleUserPageDetails(data)
        }


    }

    // ! to ensure that we always have some data in the SingleUserPageDetails 
    if(!singleUserPageDetails){
        getSingleUserDetails();
    }
    console.log(singleUserPageDetails)

    if(!followersTweet){
        getLoggedInDetails()
    }

    console.log(followersTweet)
  

    
    





    




    


    // const tweets = getFollowersTweet(loggedInUser)

    // console.log(tweets)

  
   
    
    const getAllTweets = async()=>{
        try {
            const authData = localStorage.getItem("auth");
        if(authData){
            var authDataToUse = JSON.parse(authData);
            const {data} = await axios.get('/tweet/getAllTweets',{
                headers:{
                    Authorization:`Bearer ${authDataToUse?.token}`
                }
            });
           if(data?.tweets){

               setAllTweets(data?.tweets)

           }
          
           
        }
            
        } catch (error) {
            console.log(error)
        }
    }

    
    


    if(followersTweet){
        console.log(followersTweet)
    }
    


    
   
   
    // ! create tweet Modal

    useEffect(()=>{
        const authData = localStorage.getItem("auth");
        if(authData){
            const parsed = JSON.parse(authData);
            setAuthDetails({...authDetails,user : parsed.user,token:parsed.token})
        }
        getAllTweets()
        getLoggedInDetails()

    },[])

    
   







    return (

        <TweetData.Provider value={{showSingleTweet,sendDeleteRequestToBackend,sendRequestToBackendToReTweeet,fetchDetailsOfTweetToCommentOn,getSingleUserDetails,sendLikeRequest,auth,tweetToAddACommentOn,setAuthDetails,setTweetToAddACommentOn, tweetBool,setTweetBool,followersTweet,allTweets,getAllTweets,authDetails,setAuthDetails,singleUserPageDetails }}>
            {children}
        </TweetData.Provider>
    )
}

const useTweetData = () => useContext(TweetData)

export { useTweetData, TweetProvider }