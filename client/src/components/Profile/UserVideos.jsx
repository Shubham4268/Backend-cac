import axios from "axios";
import { useEffect, useState } from "react";
import VideoComponent from "../VideoComponents/VideoComponent";
import { toast, ToastContainer } from "react-toastify";

function UserVideos({ user ,notify}) {
  const currUser = user;
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/v1/dashboards/videos/${currUser?._id}`
      );
      const { data } = response?.data || {};
      setVideos(data);
    };
    fetchVideos();
  }, [currUser?._id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 justify-items-center gap-4 min-h-full w-11/12 m-auto">

      {videos?.map((video) => (
        <div
          key={video._id}
          className="p-2 items-center my-5 w-3/5 md:w-5/6 border border-gray-500 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800 "
        >
          <VideoComponent videofile={video} notify={notify} />
        </div>
      ))}
    </div>
  );
}

export default UserVideos;
