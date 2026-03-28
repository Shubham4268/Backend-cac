import { useEffect, useState } from "react";
import { VideoDetails, VideoFile, VideoDetailSkeleton, CommentsSection } from "../components";
import { handleApiError } from "../utils/errorHandler";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { setLoading } from "../features/slices/loaderSlice.js";
import { useDispatch, useSelector } from "react-redux";

function Video() {
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const notify = (text) => toast(text);
  const theme = useSelector((state) => state.theme.theme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  return (
    <div className="mt-24 px-6 lg:px-12 max-w-[1600px] mx-auto">


      {error && (
        <p className="text-red-500 text-center mb-5 mt-32">
          {error || "Failed to load video"}
        </p>
      )}

      {/* Render Skeletons while fetching */}
      {isLoading && !error && <VideoDetailSkeleton />}

      {/* Equal height grid — only render smoothly when data exists */}
      {!isLoading && !error && video && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mt-6">
          {/* 🎥 Video stage */}
          <div className="lg:col-span-2 flex">
            <div className="relative w-full h-[500px] bg-black rounded-2xl overflow-hidden shadow-2xl ml-0 lg:ml-10 flex items-center justify-center">
              <VideoFile video={video} />
            </div>
          </div>

          {/* 📦 Details — forced to same height */}
          <div className="lg:col-span-1 flex">
            <div className="w-full lg:w-[450px] lg:h-[500px]">
              <VideoDetails video={video} notify={notify} />
            </div>
          </div>
        </div>
      )}

      {/* 💬 Comments section */}
      <div className="max-w-[1390px] mx-auto">
        {!isLoading && !error && video && (
          <CommentsSection videoId={id} />
        )}
      </div>
    </div>
  );

}


export default Video;
