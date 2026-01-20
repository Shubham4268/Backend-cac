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
  const loggedInUser = useSelector(
    (state) => state.user?.userData?.loggedInUser
  );
  const isOwner = loggedInUser?._id === user?._id;
  const theme = useSelector((state) => state.theme.theme);
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
    <div className="w-full flex flex-col items-center">

      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className={`text-3xl font-semibold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent" : "text-gray-900"}`}>
          {isOwner ? "Your Tweets" : `${user?.fullName}'s Tweets`}
        </h2>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm mt-1`}>
          {isOwner ? "Thoughts, updates, and moments you’ve shared" : `Thoughts shared by ${user?.fullName}`  }
        </p>
      </div>

      {/* Empty state */}
      {tweetData && !tweetData.userTweets?.length && (
        <div className="mt-20 text-center">
          <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>No posts yet</h2>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-2`}>
            This channel hasn’t shared anything yet.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-center mt-10">
          {error || "Failed to load tweets"}
        </p>
      )}

      {/* Feed */}
      {tweetData?.userTweets?.length > 0 && (
        <div className="w-full max-w-2xl flex flex-col gap-8">
          {tweetData.userTweets.map((tweet) => (
            <div
              key={tweet._id}
              className={`
              relative
              rounded-3xl
              px-6 py-5
              shadow-lg
              hover:shadow-xl
              transition-all
              ${theme === "dark"
                  ? "bg-gradient-to-b from-gray-800/80 to-gray-900/90 backdrop-blur"
                  : "bg-white border border-gray-200"
                }
            `}
            >
              <span className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-indigo-500 to-cyan-400" />

              <TweetComponent
                tweet={tweet}
                tweetData={tweetData}
                refreshTweets={fetchTweets}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );

}

export default UserTweets;
