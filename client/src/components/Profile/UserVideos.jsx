import axios from "axios";
import { useEffect, useState } from "react";
import VideoComponent from "../video/VideoComponent.jsx";
// import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";
import { handleApiError } from "../../utils/errorHandler.js";
import { EditVideoModal, DeleteConfirmationModal } from "../index.js";
import toast from "react-hot-toast";

function UserVideos({ user, notify }) {
  const currUser = user;
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const loggedInUser = useSelector((state) => state.user?.userData?.loggedInUser);
  const isOwner = loggedInUser?._id == currUser?._id;
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  useEffect(() => {
    fetchVideos();
  }, [currUser?._id, dispatch]);

  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;
    try {
      setDeleteLoading(true);
      dispatch(setLoading(true));
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/videos/${videoToDelete._id}`);
      if (response?.data?.success) {
        toast.success("Video deleted successfully");
        setVideoToDelete(null);
        fetchVideos();
      }
    } catch (err) {
      handleApiError(err, setError);
    } finally {
      setDeleteLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleUpdateInList = (updatedVideo) => {
    setVideos((prev) => prev.map((v) => v._id === updatedVideo._id ? updatedVideo : v));
  };

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
                <VideoComponent 
                  key={video._id}
                  videofile={video} 
                  notify={notify} 
                  isOwner={isOwner} 
                  onEdit={setEditingVideo}
                  onDelete={() => setVideoToDelete(video)}
                  className={`
                    group
                    rounded-xl
                    shadow-md hover:shadow-xl
                    transition-all duration-300
                    ${theme === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                    }
                  `}
                />
            ))}
          </div>
        )}

        {editingVideo && (
          <EditVideoModal 
            video={editingVideo} 
            onClose={() => setEditingVideo(null)} 
            onUpdate={handleUpdateInList} 
          />
        )}

        {videoToDelete && (
          <DeleteConfirmationModal
            videoTitle={videoToDelete.title}
            onClose={() => setVideoToDelete(null)}
            onConfirm={handleDeleteVideo}
            loading={deleteLoading}
          />
        )}
      </div>
    </div>
  );
}
export default UserVideos;
