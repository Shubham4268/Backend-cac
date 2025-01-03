import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoComponent from "../components/VideoComponents/VideoComponent";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

function Subscription() {
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [error, setError] = useState(null);
  const notify = (text) => toast(text);
  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const id = user?._id;

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/subscriptions/u/${id}`,
        {
          params: {
            page: currentPage,
            limit,
          },
        }
      );

      const { success, data } = response.data;
      if (success) {
        setVideos(data.videos);
        setChannels(data.channels);
        setTotalVideos(data.pagination.totalVideos);
        setError(null); // Reset error if the request is successful
      } else if (data.videos.length === 0) {
        setError("No videos found from your subscribed channels.");
      }
    } catch (error) {
      setError("An error occurred while fetching videos.");
      console.error(error);
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

  console.log(channels);

  return (
    <>
      <div className="mt-24 mb-4 ml-[13.5rem] pt-6 w-full h-full ">
        <span className="self-start ml-10 text-white text-4xl font-medium">
          Your Subscriptions
        </span>
        <hr className="mt-8 mr-2 " />
        <div className="h-40 mt-2 flex z-50 flex-row flex-nowrap max-w-screen-xl overflow-x-scroll">
          {channels?.map((channel) => (
            <div key={channel?._id} className="mx-3 self-center max-w-28">
              {/* Image */}
              <Link to={`/profile/${channel?.channel?.username}`}>
                <img
                  className="min-w-28 min-h-28 z-10 rounded-full"
                  src={channel?.channel?.avatar}
                  alt={channel?.channel?.fullName}
                />

                {/* Full Name Text Box on Hover */}

                <div className="text-center text-white mt-1 relative group">
                  {/* Truncated name */}
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-slate-200">
                    {channel?.channel?.fullName}
                  </div>

                  {/* Full name on hover */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {channel?.channel?.fullName}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <hr className=" mr-2" />

        <div className="flex flex-col items-center text-white">
          <ToastContainer />
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 justify-items-center gap-4 min-h-full w-full mt-4">
            {error && <p className="text-blue-500 text-center mb-5">{error}</p>}
            {!error &&
              videos?.map((video) => (
                <div
                  key={video?._id}
                  className="p-2 items-center my-5 w-3/5 md:w-4/5 border border-gray-500 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800"
                >
                  <VideoComponent videofile={video} notify={notify} />
                </div>
              ))}
          </div>
          {!error && videos.length > 0 && (
            <div className="mb-5 flex left-auto bottom-0 justify-between text-center items-center mt-4 w-1/2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePagination("prev")}
                className="p-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-white">
                Page {currentPage} of {Math.ceil(totalVideos / limit)}
              </p>
              <button
                disabled={currentPage * limit >= totalVideos}
                onClick={() => handlePagination("next")}
                className="p-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Subscription;
