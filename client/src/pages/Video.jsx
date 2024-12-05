import { useEffect, useState } from "react";
import { VideoDetails, VideoFile } from "../components";
import { handleApiError } from "../utils/errorHandler";
import axios from "axios";
import { useParams } from "react-router-dom";

function Video() {
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/videos/${id}`
        );

        const { data } = response || {};
        const { data: videoData } = data || {};
        console.log(videoData);
        setVideo(videoData);
      } catch (error) {
        handleApiError(error, setError);
      }
    };

    fetchVideo();
  }, [id]);

  return (
    <div className="flex flex-row mt-28 ml-10 w-full">
      {error && (
        <p className="text-red-500 text-center mb-5">
          {error || "Failed to load video"}
        </p>
      )}
      <div className="gap-20">
        <div className="w-[44rem] h-[26rem] rounded-xl ">
          {video ? (
            <VideoFile video={video} />
          ) : (
            <p className="text-white">Loading video...</p>
          )}
        </div>
      </div>

      <div className="text-white w-1/2 mx-10 border border-gray-500 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800 ">
      {video ? (
            < VideoDetails video={video}/>
          ) : (
            <p className="text-white">Loading Details...</p>
          )}
        </div>
    </div>
  );
}

export default Video;
