import { useEffect, useState } from "react";
import { TweetComponent } from "../components";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { handleApiError } from "../utils/errorHandler";

function TweetsPage() {
  const [tweetData, setTweetData] = useState(null);
  const [error, setError] = useState(null);

  // const {id} = useParams()
  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const id = user?._id;

  const handleDelete = async (userTweet) => {
    try {
      const deleteTweet = await axios.delete(
        `http://localhost:8000/api/v1/tweets/${userTweet._id}`
      );
      console.log(deleteTweet);
      
    } catch (error) {
        handleApiError(error,setError)
    }
  };
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/tweets/user/${id}`
        );
        if (response) {
          setTweetData(response?.data?.data);
        }
      } catch (error) {
        handleApiError(error, setError);
      }
    };

    fetchTweets();
  }, [id]);

  return (
    <div className="ml-56 mt-28 text-white w-full h-full">
        {error && (
        <p className="text-red-500 text-center mb-5">
          {error || "Failed to load tweets"}
        </p>
      )}
      {
        tweetData?.userTweets?.map((tweet)=>(
            <div key={tweet._id} className="mb-8">
                {console.log(tweet)}
                
                <TweetComponent tweet={tweet} tweetData = {tweetData} handleDelete={handleDelete}/>
            </div>
        ))
      }
    </div>
  );
}

export default TweetsPage;
