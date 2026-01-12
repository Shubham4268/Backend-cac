import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VideoComponent } from "../components";
import { toast, ToastContainer } from "react-toastify";
import { setLoading } from "../features/slices/loaderSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { handleApiError } from "../utils/errorHandler.js";

function Playlist() {
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const notify = (text) => toast(text);
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.navbar.collapsed);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    try {
      dispatch(setLoading(true));
      const fetchVideos = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/${id}`
        );
        setVideos(response?.data?.data?.videos);
        setPlaylist(response?.data?.data);
      };
      fetchVideos();
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      dispatch(setLoading(false));
    }
  }, [id, videos]);

  return (
    <>
      <div className={`flex flex-col items-center mt-24 mb-4 pt-6 w-full h-full transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"
        } ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        {error && (
          <p className="mb-4 text-red-500 text-center text-sm">{error}</p>
        )}
        <span className={`self-start ml-12 text-4xl font-medium ${theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
          {playlist?.name}
        </span>
        <span className={`self-start ml-12 mt-3 font-light w-full mr-5 ${theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
          Description: {playlist?.description}
        </span>
        <ToastContainer />
        {videos?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 justify-items-center gap-4 min-h-full w-full mt-4">
            {videos?.map((video) => (
              <div
                key={video?._id}
                className={`p-2 items-center my-5 w-3/5 md:w-4/5 border rounded-lg shadow md:flex-row md:max-w-xl ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}
              >
                <VideoComponent videofile={video} notify={notify} />
              </div>
            ))}
          </div>
        ) : (
          <span className={`mt-20 text-3xl ${theme === "dark" ? "text-white" : "text-gray-900"
            }`}>No videos in this playlist !!</span>
        )}
      </div>
    </>
  );
}

export default Playlist;
