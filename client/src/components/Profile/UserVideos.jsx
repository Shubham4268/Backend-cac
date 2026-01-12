import axios from "axios";
import { useEffect, useState } from "react";
import VideoComponent from "../video/VideoComponent.jsx";
// import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";
import { handleApiError } from "../../utils/errorHandler.js";

function UserVideos({ user, notify }) {
  const currUser = user;
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const loggedInUser = useSelector((state) => state.user?.userData?.loggedInUser);
  const isOwner = loggedInUser?._id === currUser?._id;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/dashboards/videos/${currUser?._id
          }`
        );
        const { data } = response?.data || {};
        setVideos(data);
      } catch (error) {
        handleApiError(error, setError);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchVideos();
  }, [currUser?._id, dispatch]);

  return (
    <div className="w-full flex justify-center px-6">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className={`text-3xl font-semibold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent" : "text-gray-900"}`}>
            {isOwner ? "Your Videos" : `${currUser?.fullName}'s Videos`}
          </h2>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm mt-1`}>
            {isOwner ? "Videos you’ve uploaded and published" : `Videos uploaded by ${currUser?.fullName}`}
          </p>
        </div>

        {error && (
          <p className="mb-6 text-red-400 text-center text-sm">{error}</p>
        )}

        {!videos.length && !error && (
          <div className="mt-28 text-center">
            <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>No Videos yet</h2>
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-2`}>
              This channel hasn’t uploaded any videos.
            </p>
          </div>
        )}

        {videos.length > 0 && (
          <div
            className="
            grid gap-8 mt-10
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            
          "
          >
            {videos.map((video) => (
              <div
                key={video._id}
                className={`
                  group
                  rounded-2xl
                  overflow-hidden
                  backdrop-blur
                  shadow-md hover:shadow-xl
                  transition-all duration-300
                  ${theme === "dark"
                    ? "bg-gradient-to-b from-gray-800/60 to-gray-900/80"
                    : "bg-white border border-gray-200"
                  }
                `}
              >
                <VideoComponent videofile={video} notify={notify} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default UserVideos;
