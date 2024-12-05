import VideoComponent from "../components/VideoComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { handleApiError } from "../utils/errorHandler.js";

axios.defaults.withCredentials = true; // This ensures that cookies are sent with each request

// Base URL of your backend API

function Home() {
  const [videos, setVideos] = useState([]);

  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const allVideos = await axios.get(
          "http://localhost:8000/api/v1/videos"
        );

        const { data: response } = allVideos || {};
        const { success } = response || false;
        const { data } = response || {};

        if (success) {
          setVideos(data.videos);
          console.log(data);
          
        }
      } catch (error) {
        handleApiError(error, setError);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
        <div className="font-serif grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 justify-items-center gap-4 min-h-full w-full mt-24 mb-4 ml-56 pt-6 text-white ">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {videos?.map((video) => (
            <div key={video._id} className="p-2 items-center my-5 w-3/5 md:w-4/5  border border-gray-500 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <VideoComponent {...video} />
            </div>
          ))}
        </div>
    </>
  );
}

export default Home;
