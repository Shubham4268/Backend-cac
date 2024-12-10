import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import LikeButton from "../Common/LikeButton";
import SubscribeButton from "../Common/SubscribeButton";

function VideoDetails({ video }) {
  const [subscribers, setSubscribers] = useState(null);
  const [liked, setLiked] = useState(null);
  const [subscribed, setSubscribed] = useState(null);
  const [likesCount, setLikesCount] = useState(null);
  const videoFile = useMemo(() => video || {}, [video]);

  const owner = videoFile.owner;

  useEffect(() => {
    const fetchChannelStats = async () => {
      if (!owner?._id) return; // Avoid API call if owner or _id is missing

      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/dashboards/stats/${owner._id}`
        );

        const { data: info } = response || {};
        const { data } = info || {};
        const {getTotalSubscribers} = data || 0
        const {subscribedStatus} = data || null
        setSubscribers(getTotalSubscribers);
        setSubscribed(subscribedStatus)
        const likeResponse = await axios.get(
          `http://localhost:8000/api/v1/likes/v/${videoFile._id}`
        );

        const { data: likeData } = likeResponse || {};
        const { data: returnObject } = likeData || {};
        const { statusOfLike } = returnObject;
        const { likesOnVideo } = returnObject || 0;

        setLiked(statusOfLike);
        setLikesCount(likesOnVideo);
      } catch (error) {
        console.error("Error fetching channel stats:", error);
      }
    };

    fetchChannelStats();
  }, [owner, videoFile._id]);

  const formatDate = (date) => {
    if (!date) return "Unknown Date";
    const now = new Date(date); // Use provided date
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onclick = async () => {
    const response = await axios.post(
      `http://localhost:8000/api/v1/likes/toggle/v/${videoFile._id}`
    );

    const { data } = response || {};
    const { data: likeData } = data;

    if (!likeData) {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    } else {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    }
  };

  const onSubscribeClick = async () => {
    const channelId = owner?._id;

    const response = await axios.post(
      `http://localhost:8000/api/v1/subscriptions/c/${channelId}`
    );

    const { data: info } = response || {};
    const { data} = info || {};

    if(!data){
      setSubscribed(true)
      setSubscribers((prev)=>prev+1)
    }else{
      setSubscribed(false)
      setSubscribers((prev)=>prev-1)
    }
    
  };

  return (
    <div className="relative flex flex-col shadow-lg h-full my-3">
      <span className="text-center font-bold text-2xl underline mb-2 ">
        About Video
      </span>
      <div className="font-bold my-3 mx-5">
        {videoFile.title || "Untitled Video"}
      </div>
      <div className="flex flex-col space-y-2 mb-3">
        <span className="mx-5">{videoFile.views || 0} Views</span>
        <span className="mx-5">
          Uploaded Date: {formatDate(videoFile.createdAt)}
        </span>
      </div>
      <div className="flex flex-col border border-gray-500 bg-gray-700 rounded-lg shadow mx-3 p-2 h-28 max-h-28">
        <span className="mb-1">Description :</span>
        <span className="overflow-auto p-1 rounded-lg">
          {videoFile.description || "No description available."}
        </span>
      </div>
      <div className="absolute flex justify-between bottom-3 right-0 w-full h-[78px] border-t border-gray-400">
        <div className="flex">
          {owner ? (
            <>
              <img
                className="w-14 h-14 self-center ml-3 rounded-full"
                src={owner?.avatar || "default-avatar.png"}
                alt="Owner Avatar"
              />
              <div className="flex flex-col ml-3 mt-3">
                <span>{owner?.fullName || "Unknown User"}</span>
                <span>
                  {subscribers < 2
                    ? `${subscribers || 0} Subscriber`
                    : `${subscribers || 0} Subscribers`}
                </span>
              </div>
            </>
          ) : (
            <div className="ml-3 mt-3 text-gray-500">
              Owner deleted or not available.
            </div>
          )}
        </div>
        <div className="self-center ">
          <SubscribeButton onclick={onSubscribeClick} subscribed={subscribed} />
        </div>
        <div className="flex">
          <LikeButton onclick={onclick} liked={liked} />
          <span className="self-center mr-8">{likesCount}</span>
        </div>
      </div>
    </div>
  );
}

export default VideoDetails;
