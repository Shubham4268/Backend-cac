import axios from "axios";
import { useEffect, useState } from "react";
import VideoComponent from "../video/VideoComponent.jsx";
// import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";
import { handleApiError } from "../../utils/errorHandler.js";

function UserVideos({ user, notify }) {
  const currUser = user;
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/dashboards/videos/${
            currUser?._id
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
          <h2 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Your Videos
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Videos you’ve uploaded and published
          </p>
        </div>

        {error && (
          <p className="mb-6 text-red-400 text-center text-sm">{error}</p>
        )}

        {!videos.length && !error && (
          <div className="mt-28 text-center">
            <h2 className="text-3xl font-bold text-white">No Videos yet</h2>
            <p className="text-gray-400 mt-2">
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
                className="
                  group
                  rounded-2xl
                  overflow-hidden
                  bg-gradient-to-b from-gray-800/60 to-gray-900/80
                  backdrop-blur
                  shadow-md hover:shadow-xl
                  transition-all duration-300
                "
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
