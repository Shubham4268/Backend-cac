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
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/videos/${id}`
        );

        const { data } = response || {};
        const { data: videoData } = data || {};

        if (data.success) {
          setVideo(videoData);
          await axios.post(
            `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/views/${id}`
          );
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
  <div className="mt-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
    <ToastContainer />

    {error && (
      <p className="text-red-500 text-center mb-5">
        {error || "Failed to load video"}
      </p>
    )}

    {/* Equal height grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

      {/* 🎥 Video stage */}
      <div className="lg:col-span-2 flex">
        <div className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video ml-10">
          {video ? (
            <VideoFile video={video} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Loading video...
            </div>
          )}
        </div>
      </div>

      {/* 📦 Details — forced to same height */}
      <div className="lg:col-span-1 flex">
        {video ? (
          <div className="w-full h-full">
            <VideoDetails video={video} notify={notify} />
          </div>
        ) : (
          <div className="text-gray-400">Loading details...</div>
        )}
      </div>
    </div>
  </div>
);

}


export default Video;
