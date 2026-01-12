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
import { useDispatch, useSelector } from "react-redux";
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
  const currUser = useSelector((state) => state.user.userData);
  // console.log("currUser: ",currUser.loggedInUser._id);
  // console.log("user: ",user._id);
  console.log(currUser?.loggedInUser?._id == user?._id);



  // ✅ already there, now we will USE it
  const collapsed = useSelector((state) => state.navbar.collapsed);
  const theme = useSelector((state) => state.theme.theme);

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
  }, [username]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (user?._id) {
        try {
          dispatch(setLoading(true));
          const dashResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/dashboards/stats/${user._id}`
          );

          if (dashResponse?.data?.success) {
            setChannelInfo(dashResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    fetchDashboardStats();
  }, [user?._id]);

  const onSubscribeClick = async () => {
    const channelId = user?._id;

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/subscriptions/c/${channelId}`
    );

    if (!response?.data?.data) {
      setSubscribed(true);
      setSubscribers((prev) => prev + 1);
    } else {
      setSubscribed(false);
      setSubscribers((prev) => prev - 1);
    }
  };

  if (!user) {
    return (
      <div className={`mt-24 text-center ${theme === "dark" ? "text-white" : "text-gray-900"
        }`}>
        Loading profile...
      </div>
    );
  }

  return (
    // ✅ THIS is the important part
    <div
      className={`
        mt-16 min-h-screen transition-all duration-300 ease-in-out
        ${collapsed ? "ml-16 w-[calc(100%-4rem)]" : "ml-60 w-full"}
        ${theme === "dark"
          ? "text-white bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
          : "text-gray-900 bg-gradient-to-b from-gray-50 via-white to-gray-50"
        }
      `}
    >
      <ToastContainer className="z-10" />

      {/* Hero */}
      <div className={`relative overflow-hidden border-b ${theme === "dark" ? "border-white/10" : "border-gray-200"
        }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-fuchsia-500/10 to-cyan-500/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-10 py-14 flex items-center gap-10">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 blur opacity-30" />
            <img
              src={user?.avatar}
              alt={user?.fullName}
              className="relative w-40 h-40 rounded-full object-cover border-4 border-gray-800 shadow-2xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-bold tracking-tight">
              {user?.fullName}
            </h1>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>@{user?.username}</p>

            <div className={`flex items-center gap-4 text-sm mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
              <span>{subscribers} subscribers</span>
              <span>•</span>
              <span>{channelInfo?.getTotalVideos || 0} videos</span>
            </div>

            <div className="mt-4">
              <SubscribeButton
                onclick={onSubscribeClick}
                subscribed={subscribed}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`mt-4 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200"
        }`}>
        <div className="max-w-7xl mx-auto px-10 flex justify-evenly py-3">
          <SectionTab label="Videos" active={activeDiv === 1} onClick={() => setActiveDiv(1)} />
          <SectionTab label="Tweets" active={activeDiv === 2} onClick={() => setActiveDiv(2)} />
          {currUser?.loggedInUser?._id == user?._id && <SectionTab label="Playlists" active={activeDiv === 3} onClick={() => setActiveDiv(3)} />}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-10 py-10">
        <div className={`rounded-3xl p-8 ${theme === "dark" ? "bg-gray-900/60" : "bg-white/80 border border-gray-200"
          }`}>
          {activeDiv === 1 && <UserVideos user={user} notify={notify} />}
          {activeDiv === 2 && <UserTweets user={user} />}
          {activeDiv === 3 && <UserPlaylists user={user} />}
        </div>
      </div>
    </div>
  );
}

const SectionTab = ({ label, active, onClick }) => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <button
      onClick={onClick}
      className={`
        relative px-8 py-3 rounded-full text-sm font-semibold tracking-wide
        transition-all duration-200
        ${active
          ? theme === "dark"
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
            : "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-sm"
          : theme === "dark"
            ? "text-gray-300 hover:bg-white/5 hover:text-white"
            : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
        }
      `}
    >
      {label}
    </button>
  );
};

export default Profile;
