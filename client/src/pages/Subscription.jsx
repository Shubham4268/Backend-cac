import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoComponent from "../components/video/VideoComponent";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { TweetComponent } from "../components";
import { setLoading } from "../features/slices/loaderSlice";

function Subscription() {
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [tweetData, setTweetData] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState("videos");
  const [limit, setLimit] = useState(9);
  const [error, setError] = useState(null);
  const notify = (text) => toast(text);
  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const id = user?._id;
  const dispatch = useDispatch();
  console.log(channels);
  const collapsed = useSelector((state) => state.navbar.collapsed);

  const fetchVideos = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/subscriptions/u/${id}`,
        {
          params: {
            page: currentPage,
            limit,
          },
        }
      );

      const { success, data } = response.data;
      if (success) {
        setError(null);
        setVideos(data.videos);
        setChannels(data.channels);
        setTweetData(data.tweets);
        setTotalVideos(data.pagination.totalVideos);
        setError(null); // Reset error if the request is successful
      } else if (!data.channels) {
        setError("No Channels are subscribed.");
      } else if (!data.videos) {
        setError("No videos found from your subscribed channels.");
      }
    } catch (error) {
      setError("An error occurred while fetching ");
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (id) {
      fetchVideos();
    }
  }, [id, currentPage, limit]);

  const handlePagination = (direction) => {
    setCurrentPage((prevPage) =>
      direction === "next" ? prevPage + 1 : prevPage - 1
    );
  };

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };
  return (
    <>
      <div
        className={`mt-20 mb-4 pt-6 w-full min-h-screen transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-60"
        }`}
      >

        {!channels.length ? (
          <div className="my-20 w-full text-center text-3xl  text-white">
            You have not subscribed to any channels yet
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-4 px-6 ">
              Subscribed Channels
            </p>
            <div
              className={`h-40 mt-2 flex z-50 flex-row flex-nowrap ml-6  ${
                collapsed ? "max-w-[1450px]" : "max-w-screen-xl"
              } scroll-smooth  overflow-x-scroll flex gap-6 pb-4 scrollbar-thin scrollbar-thumb-gray-800`}
            >
              {channels?.map((channel) => (
                <div key={channel?._id} className="flex-shrink-0 text-center">
                  <Link to={`/profile/${channel?.channel?.username}`}>
                    <div className="relative group">
                      <img
                        className="
                          w-24 h-24 rounded-full object-cover
                          border border-gray-800
                          group-hover:scale-105 transition
                        "
                        src={channel?.channel?.avatar}
                        alt={channel?.channel?.fullName}
                      />

                      <div
                        className="
                        absolute inset-0 rounded-full
                        bg-black/40 opacity-0 group-hover:opacity-100 transition
                      "
                      />
                    </div>

                    <div className="mt-2 text-sm text-gray-300 truncate w-24 mx-auto">
                      {channel?.channel?.fullName}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Tabs - Centered with wide spacing */}
        <div className="mt-8 mb-6 flex justify-center">
          <div className="flex gap-12">
            <button
              onClick={() => setSelectedOption("videos")}
              className={`
                relative px-10 py-3.5 rounded-full text-base font-semibold tracking-wide
                transition-all duration-200
                ${
                  selectedOption === "videos"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white border border-gray-700"
                }
              `}
            >
              📹 Videos
            </button>
            
            <button
              onClick={() => setSelectedOption("tweets")}
              className={`
                relative px-10 py-3.5 rounded-full text-base font-semibold tracking-wide
                transition-all duration-200
                ${
                  selectedOption === "tweets"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white border border-gray-700"
                }
              `}
            >
              💬 Tweets
            </button>
          </div>
        </div>
        
        <div className="px-3">
          <hr className="border-gray-800" />
        </div>

        <ToastContainer />
        {selectedOption === "videos" && (
          <div className="px-6 mt-10 text-white">
            {channels.length !== 0 && !videos.length && (
              <div className="mt-24 w-full text-center text-3xl font-bold text-gray-300">
                No Videos yet
              </div>
            )}

            <div
              className={`grid gap-8 min-h-full w-full ${
                collapsed ? "grid-cols-4" : "grid-cols-3"
              }`}
            >
              {!error &&
                videos?.map((video) => (
                  <div
                    key={video?._id}
                    className={`max-w-xs mx-auto w-full ${
                      collapsed ? "" : "scale-110 my-5"
                    }`}
                  >
                    <VideoComponent videofile={video} notify={notify} />
                  </div>
                ))}
            </div>

            {!error && videos.length > 0 && (
              <div className="mt-16 flex justify-center items-center gap-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePagination("prev")}
                  className="
                    px-4 py-2 rounded-xl bg-gray-900 border border-gray-800
                    hover:bg-gray-800 transition disabled:opacity-40
                  "
                >
                  Previous
                </button>

                <p className="text-gray-400 text-sm">
                  Page{" "}
                  <span className="text-white font-medium">{currentPage}</span>{" "}
                  of{" "}
                  <span className="text-white font-medium">
                    {Math.ceil(totalVideos / limit)}
                  </span>
                </p>

                <button
                  disabled={currentPage * limit >= totalVideos}
                  onClick={() => handlePagination("next")}
                  className="
                    px-4 py-2 rounded-xl bg-gray-900 border border-gray-800
                    hover:bg-gray-800 transition disabled:opacity-40
                  "
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* TWEETS */}
        {selectedOption === "tweets" && (
          <div className="w-full flex justify-center px-6 mt-6 text-white">
            <div className="w-full max-w-2xl">
              {channels.length !== 0 && !tweetData?.length && (
                <div className="mt-28 text-center">
                  <h2 className="text-3xl font-bold text-white">
                    No Tweets yet
                  </h2>
                  <p className="text-gray-400 mt-2">
                    Your subscribed channels haven’t posted anything yet.
                  </p>
                </div>
              )}

              {tweetData?.length > 0 && (
                <div className="flex flex-col gap-8 mt-6">
                  {tweetData.map((data) =>
                    data?.userTweets?.map((tweet) => (
                      <div
                        key={tweet._id}
                        className="
                  relative
                  bg-gradient-to-b from-gray-800/80 to-gray-900/90
                  backdrop-blur
                  rounded-3xl
                  px-6 py-5
                  shadow-lg
                  hover:shadow-xl
                  transition-all
                "
                      >
                        {/* subtle left accent */}
                        <span className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-indigo-500 to-cyan-400" />

                        <TweetComponent
                          tweet={tweet}
                          tweetData={data}
                          refreshTweets={fetchVideos}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default Subscription;
