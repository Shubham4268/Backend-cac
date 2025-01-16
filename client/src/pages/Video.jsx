import { useEffect, useState } from "react";
import { VideoDetails, VideoFile } from "../components";
import { handleApiError } from "../utils/errorHandler";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { setLoading } from "../features/slices/loaderSlice.js";
import { useDispatch } from "react-redux";

function Video() {
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const notify = (text) => toast(text);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchVideo = async () => {
      try {
        // First, fetch the video details
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/videos/${id}`
        );

        const { data } = response || {};
        const { data: videoData } = data || {};

        // Check if video was fetched successfully
        if (data.success) {
          setVideo(videoData); // Set the fetched video data
          // Increment the view count on the server
          await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/views/${id}`);
        } else {
          throw new Error("Failed to fetch video");
        }
      } catch (error) {
        handleApiError(error, setError);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchVideo();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row mt-28 ml-10 md:w-full justify-evenly h-screen">
      {error && (
        <p className="text-red-500 text-center mb-5">
          {error || "Failed to load video"}
        </p>
      )}
      <ToastContainer />
      <div className="gap-20">
        <div className="w-[44rem] h-3/4 bg-gray-800 rounded-xl ">
          {video ? (
            <VideoFile video={video} />
          ) : (
            <p className="text-white">Loading video...</p>
          )}
        </div>
      </div>

      <div className="text-white h-3/4 w-full md:w-1/2 md:mx-10 mx-10 border border-gray-500 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800 ">
        {video ? (
          <VideoDetails video={video} notify={notify} />
        ) : (
          <p className="text-white">Loading Details...</p>
        )}
      </div>
    </div>
  );
}

export default Video;
