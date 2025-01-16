import axios from "axios";
import { useEffect, useState } from "react";
import VideoComponent from "../VideoComponents/VideoComponent";
import { toast, ToastContainer } from "react-toastify";
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
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/dashboards/videos/${currUser?._id}`
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
  }, [currUser?._id]);

  return (
    <>
      {error && (
        <p className="mb-4 text-red-500 text-center text-sm">{error}</p>
      )}
      {!videos.length && (
        <div className="mt-20 w-full text-center text-3xl font-bold">
          No Videos yet
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 justify-items-center gap-4 min-h-full w-11/12 m-auto">
        {videos?.map((video) => (
          <div
            key={video._id}
            className="p-2 items-center my-5 w-3/5 md:w-5/6 border border-gray-500 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800 "
          >
            <VideoComponent videofile={video} notify={notify} />
          </div>
        ))}
      </div>
    </>
  );
}

export default UserVideos;
