import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  SubscribeButton,
  UserVideos,
  UserTweets,
  UserPlaylists,
} from "../components";

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [subscribed, setSubscribed] = useState(null);
  const [subscribers, setSubscribers] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [activeDiv, setActiveDiv] = useState(1  );

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/v1/users/channel/${username}`
      );
      if (response?.data?.success) {
        const { data: currentUser } = response.data;
        setUser(currentUser);
        setSubscribers(user?.subscribersCount);
        setSubscribed(user?.isSubscribed);

        const userId = user?._id;
        const dashResponse = await axios.get(
          `http://localhost:8000/api/v1/dashboards/stats/${userId}`
        );

        if (dashResponse?.data?.success) {
          const { data: dashboard } = dashResponse.data;
          setChannelInfo(dashboard);
        }
      }
    };
    fetchUser();
  }, [user?._id, user?.isSubscribed, user?.subscribersCount, username]);

  const onSubscribeClick = async () => {
    const channelId = user?._id;

    const response = await axios.post(
      `http://localhost:8000/api/v1/subscriptions/c/${channelId}`
    );

    const { data: info } = response || {};
    const { data } = info || {};

    if (!data) {
      setSubscribed(true);
      setSubscribers((prev) => prev + 1);
    } else {
      setSubscribed(false);
      setSubscribers((prev) => prev - 1);
    }
  };

  const handleClick = (divId) => {
    setActiveDiv(divId);
  };

  return (
    <>
      <div className=" mt-24 mb-4 ml-56 w-full text-white">
        <div className="ml-10 flex ">
          <img
            src={user?.avatar}
            alt={user?.fullName}
            className="w-48 h-48 rounded-full outline outline-1 p-1"
          />
          <div className="ml-5 flex flex-col self-center space-y-2">
            <span className="text-4xl font-medium">{user?.fullName}</span>
            <span className=" font-light">@{user?.username}</span>
            <span className=" font-light">
              {subscribers} Subscribers • {channelInfo?.getTotalVideos} Videos
            </span>
            <span></span>
            <span className="">
              <SubscribeButton
                onclick={onSubscribeClick}
                subscribed={subscribed}
              />
            </span>
          </div>
        </div>
        <div className="mt-7">
          <hr className="mr-5" />
        </div>
        <div className="flex  justify-evenly">
          <button
            className={`px-5 py-3 rounded-full w-36 my-1 ${
              activeDiv === 1 ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
            onClick={() => handleClick(1)}
          >
            Videos
          </button>

          <button
            className={`px-5 py-3 rounded-full w-36 my-1 ${
              activeDiv === 2 ? "bg-gray-800" : "hover:bg-gray-800"
            } duration-100`}
            onClick={() => handleClick(2)}
          >
            Tweets
          </button>
          <button
            className={`px-5 py-3 rounded-full w-36 my-1 ${
              activeDiv === 3 ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
            onClick={() => handleClick(3)}
          >
            Playlists
          </button>
        </div>
        <div className="mb-7">
          <hr className="mr-5" />
        </div>
        <div>
          {activeDiv === 1 && <UserVideos user={user}/>}
          {activeDiv === 2 && <UserTweets user={user}/>}
          {activeDiv === 3 && <UserPlaylists />}
        </div>
      </div>
    </>
  );
}

export default Profile;
