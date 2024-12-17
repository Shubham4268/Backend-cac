import { TweetComponent } from "../../components";
import axios from "axios";
import { handleApiError } from "../../utils/errorHandler.js";
import { useCallback, useEffect, useState } from "react";

function userTweets({user}) {
  const [tweetData, setTweetData] = useState(null);
  const [error, setError] = useState(null);

  // const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const id = user?._id;

  // Include id as a dependency for fetchTweets
  const fetchTweets = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/tweets/user/${id}`
      );
      if (response) {
        const sortedTweets = response?.data?.data?.userTweets?.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setTweetData({ ...response.data.data, userTweets: sortedTweets });
      }
    } catch (error) {
      handleApiError(error, setError);
    }
  }, [id]); // Add `id` as a dependency

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  return (
    <div className=" text-white w-full h-full">
      {error && (
        <p className="text-red-500 text-center mb-5">
          {error || "Failed to load tweets"}
        </p>
      )}
      {tweetData?.userTweets?.map((tweet) => (
        <div key={tweet._id} className="mb-8">
          <TweetComponent tweet={tweet} tweetData={tweetData} refreshTweets={fetchTweets} />
        </div>
      ))}
    </div>
  );
}
export default userTweets