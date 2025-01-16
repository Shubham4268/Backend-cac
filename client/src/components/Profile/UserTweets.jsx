import { TweetComponent } from "../../components";
import axios from "axios";
import { handleApiError } from "../../utils/errorHandler.js";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";

function UserTweets({ user }) {
  const [tweetData, setTweetData] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.user?.userData?.loggedInUser);
  const activeUser = user || loggedInUser;
  const id = activeUser?._id;

  const fetchTweets = useCallback(async () => {
    try {
      if (!id) return;
      dispatch(setLoading(true));
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/tweets/user/${id}`
      );
      if (response) {
        const sortedTweets = response.data.data.userTweets.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTweetData({ ...response.data.data, userTweets: sortedTweets });
      }
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      dispatch(setLoading(false));
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  return (
    <div className="text-white w-full h-full">
      {tweetData && !tweetData.userTweets?.length && (
        <div className="mt-20 w-full text-center text-3xl font-bold">
          No Tweets yet
        </div>
      )}
      {error && (
        <p className="text-red-500 text-center mb-5">
          {error || "Failed to load tweets"}
        </p>
      )}
      {tweetData?.userTweets?.map((tweet) => (
        <div key={tweet._id} className="mb-8">
          <TweetComponent
            tweet={tweet}
            tweetData={tweetData}
            refreshTweets={fetchTweets}
          />
        </div>
      ))}
    </div>
  );
}


export default UserTweets;
