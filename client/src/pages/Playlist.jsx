import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VideoComponent } from "../components";
import { toast, ToastContainer } from "react-toastify";

function Playlist() {
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const { id } = useParams();
  const notify = (text) => toast(text);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/v1/playlists/${id}`
      );
      setVideos(response?.data?.data?.videos);
      setPlaylist(response?.data?.data);
    };
    fetchVideos();
  }, [id]);

  return (
    <>
      <div className="flex flex-col items-center mt-24 mb-4 ml-56 pt-6 w-full h-full text-white ">
        <span className="self-start ml-12 text-white text-4xl font-medium">
          {playlist?.name}
        </span>
        <span className="self-start ml-12 text-white mt-3 font-light w-full mr-5">Description: {playlist?.description}</span>
        <ToastContainer />
        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 justify-items-center gap-4 min-h-full w-full mt-4">
          {videos?.map((video) => (
            <div
              key={video?._id}
              className="p-2 items-center my-5 w-3/5 md:w-4/5 border border-gray-500 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800 "
            >
              <VideoComponent videofile={video} notify={notify} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Playlist;
