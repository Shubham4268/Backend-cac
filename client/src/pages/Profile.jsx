import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  SubscribeButton,
  UserVideos,
  UserTweets,
  UserPlaylists,
} from "../components";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/slices/loaderSlice.js";

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [subscribed, setSubscribed] = useState(null);
  const [subscribers, setSubscribers] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [activeDiv, setActiveDiv] = useState(1);
  const notify = (text) => toast(text);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/channel/${username}`
        );

        if (response?.data?.success) {
          const { data: currentUser } = response.data;
          setUser(currentUser);
          setSubscribers(currentUser.subscribersCount);
          setSubscribed(currentUser.isSubscribed);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [user?._id, user?.isSubscribed, user?.subscribersCount, username]);

  // Effect to fetch dashboard stats only after user data is available
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (user?._id) {
        try {dispatch(setLoading(true));
          const dashResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/dashboards/stats/${user._id}`
          );

          if (dashResponse?.data?.success) {
            const { data: dashboard } = dashResponse.data;
            setChannelInfo(dashboard);
          }
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        }finally {
        dispatch(setLoading(false));
      }
      }
    };

    fetchDashboardStats();
  }, [user]); // This effect will only run when 'user' is updated

  const onSubscribeClick = async () => {
    const channelId = user?._id;

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/subscriptions/c/${channelId}`
    );

    const { data: info } = response || {};
    const { data } = info || {};
    console.log(data)
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

  if (!user) {
    return <div className="text-white">Loading profile...</div>;
  }
  return (
    <>
      <div className=" mt-24 mb-4 ml-56 w-full text-white">
        <ToastContainer className="z-10" />
        <div className="ml-10 flex ">
          <img
            src={user?.avatar}
            alt={user?.fullName}
            className="w-48 h-48 rounded-full outline outline-1 p-1 object-cover"
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
          {activeDiv === 1 && <UserVideos user={user} notify={notify} />}
          {activeDiv === 2 && <UserTweets user={user} />}
          {activeDiv === 3 && <UserPlaylists user={user} />}
        </div>
      </div>
    </>
  );
}

export default Profile;
