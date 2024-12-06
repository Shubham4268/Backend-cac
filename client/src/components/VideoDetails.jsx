import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { GrLike } from "`react-icons/gr`";

function VideoDetails({ video }) {
  const [channelStats, setChannelStats] = useState({});
  const videoFile = useMemo(() => video || {}, []);

  const owner = videoFile.owner;

  const formatDate = () => {
    const now = new Date(Date.now()); // Get the current date and time
    const day = String(now.getDate()).padStart(2, "0"); // Ensure two digits for day
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure two digits for month (0-indexed)
    const year = now.getFullYear(); // Get the full year
    return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
  };

  useEffect(() => {
    const fetchChannelStats = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/v1/dashboards/stats/${owner._id}`
      );

      const { data: info } = response || {};
      const { data } = info || {};
      setChannelStats(data);
    };
    fetchChannelStats();
  }, [owner, channelStats, videoFile]);

  return (
    <div className="relative flex flex-col shadow-lg h-full my-3">
      <span className="text-center font-bold text-2xl underline mb-2 ">
        About Video
      </span>
      <div className="font-bold my-3 mx-5">{videoFile.title}</div>
      <div className="flex flex-col space-y-2 mb-3">
        <span className="mx-5">{videoFile.views} Views</span>
        <span className="mx-5">
          Uploaded Date: {formatDate(videoFile.createdAt)}
        </span>
      </div>
      <div className="flex flex-col border border-gray-500  bg-gray-700 rounded-lg shadow mx-3 p-2 h-28 max-h-28">
        <span className="mb-1">Description :</span>
        <span className="overflow-auto p-1 rounded-lg">
          I WAS THE ONE WHO GOT TRICKED I WAS THE ONE WHO GOT TRICKEDI WAS THE
          ONE WHO GOT TRICKED I WAS THE ONE WHO GOT TRICKEDI WAS THE ONE WHO GOT
          TRICKED I WAS THE ONE WHO GOT TRICKED
        </span>
      </div>
      <div className="absolute flex justify-between bottom-3 right-0 w-full  h-[78px] border-t rou  border-gray-400">
        <div className="flex">
          <img
            className="w-14 h-14 self-center ml-1 rounded-full"
            src={owner.avatar}
            alt=""
          />
          <div className="flex flex-col ml-3 mt-3">
            <span>{owner.fullName}</span>
            <span>
              {channelStats.getTotalSubscribers < 10
                ? `${channelStats.getTotalSubscribers} Subscriber`
                : `${channelStats.getTotalSubscribers} Subscribers`}
            </span>
          </div>
        </div>
        <div className="self-center border p-3 mr-10 rounded-full shadow hover:bg-white hover:shadow-2xl hover:text-black  text-sm hover:text-base hover:border-black duration-300 ">
          <GrLike className=""/>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="flex flex-col h-full border border-gray-300">
  <div className="flex-1 p-4">
    <p>Main content of the div...</p>
  </div>
  <footer className="bg-gray-100 text-center py-3 border-t border-gray-200">
    <p>Footer content goes here...</p>
  </footer>
</div> */
}

export default VideoDetails;
