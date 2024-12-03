import Navbar from "../components/Navbar";
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
        <div className="flex flex-wrap h-screen mt-24 ml-56 pt-6 text-white  w-full bg-red-400 ">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {videos?.map((video) => (
            <div key={video._id} className="p-2 mx-11 my-5 max-w-64 min-w-64 bg-green-800">
              <VideoComponent {...video} />
            </div>
          ))}
        </div>
    </>
  );
}

export default Home;
