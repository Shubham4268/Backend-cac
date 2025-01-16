import { useCallback, useEffect, useState } from "react";
import { TweetComponent } from "../components";
import axios from "axios";
import { useDispatch } from "react-redux";
import { handleApiError } from "../utils/errorHandler";
import { useParams } from "react-router-dom";
import { setLoading } from "../features/slices/loaderSlice.js";

function TweetsPage() {
  const [tweetData, setTweetData] = useState(null);
  const [error, setError] = useState(null);

  // const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const { id } = useParams();
  const dispatch = useDispatch();

  // Include id as a dependency for fetchTweets
  const fetchTweets = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/tweets/user/${id}`
      );
      if (response) {
        const sortedTweets = response?.data?.data?.userTweets?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTweetData({ ...response.data.data, userTweets: sortedTweets });
      }
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      dispatch(setLoading(false));
    }
  }, [id]); // Add `id` as a dependency

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  return (
    <div className="ml-56 mt-28 text-white w-full h-full">
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

export default TweetsPage;
