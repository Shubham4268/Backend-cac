// import Navbar from "../components/Navbar";
import VideoComponent from "../components/VideoComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { handleApiError } from "../utils/errorHandler.js";

function Home() {
  const [videos, setVideos] = useState([]);

  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/videos/",
        );
        console.log(response.data);
        
        setVideos(response.data.videos);
        
      } catch (error) {
        console.error(error);
        handleApiError(error, setError);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      <div className="text-white">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {videos.map((video) => (
          <div key={video._id} className="p-2 max-w-72 mx-3">
            {console.log(video)}
            <VideoComponent {...video} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
