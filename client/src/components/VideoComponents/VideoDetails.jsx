import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import LikeButton from "../Common/LikeButton";
import SubscribeButton from "../Common/SubscribeButton";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";

function VideoDetails({ video, notify }) {
  const [subscribers, setSubscribers] = useState(null);
  const [liked, setLiked] = useState(null);
  const [subscribed, setSubscribed] = useState(null);
  const [likesCount, setLikesCount] = useState(null);
  const videoFile = useMemo(() => video || {}, [video]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);

  const owner = videoFile.owner;
  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchChannelStats = async () => {
      if (!owner?._id) return; // Avoid API call if owner or _id is missing

      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/dashboards/stats/${owner._id
          }`
        );

        const { data: info } = response || {};
        const { data } = info || {};
        const { getTotalSubscribers } = data || 0;
        const { subscribedStatus } = data || null;
        setSubscribers(getTotalSubscribers);
        setSubscribed(subscribedStatus);
        const likeResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/likes/v/${videoFile._id
          }`
        );

        const { data: likeData } = likeResponse || {};
        const { data: returnObject } = likeData || {};
        const { statusOfLike } = returnObject;
        const { likesOnVideo } = returnObject || 0;

        setLiked(statusOfLike);
        setLikesCount(likesOnVideo);
      } catch (error) {
        console.error("Error fetching channel stats:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/user/${user?._id
          }`
        ); // Adjust the URL accordingly

        setPlaylists(response?.data?.data);
      } catch (err) {
        setError(err.message || "Failed to load playlists");
      }
    };
    fetchPlaylists();
    fetchChannelStats();
  }, [owner, user?._id, videoFile._id]);

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
      `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/likes/toggle/v/${videoFile._id
      }`
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
      `${import.meta.env.VITE_BACKEND_BASEURL
      }/api/v1/subscriptions/c/${channelId}`
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

  const toggleDropdown = () => setIsDropdownOpen((prevState) => !prevState);
  const handleAddToPlaylist = async (playlistId) => {
    try {
      // Make API call to add the video to the playlist
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/add/${videoFile?._id
        }/${playlistId}`
      );

      // Log and notify success
      const message =
        response?.data?.message || "Video added to playlist successfully!";

      // Close modal and dropdown after successful addition
      setIsModalOpen(false);
      setIsDropdownOpen(false);

      // Display success notification
      notify(message);
    } catch (err) {
      // Log and set error message
      console.error("Error adding video to playlist:", err);

      // Provide user feedback for the error
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to add video to playlist"
      );
    }
  };
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName) return;
    setLoadingPlaylist(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/`,
        {
          name: newPlaylistName,
        }
      );
      if (response?.data?.success) {
        setPlaylists([...playlists, response?.data?.data]);

        setNewPlaylistName("");
        notify("Playlist added");

        await handleAddToPlaylist(response?.data?.data?._id);
        setIsModalOpen(false);
        setIsDropdownOpen(false);
      }
    } catch (err) {
      setError(err.message || "Failed to create playlist");
    } finally {
      setLoadingPlaylist(false);
      setError(null);
    }
  };
  return (
    <div className={`relative flex flex-col h-full rounded-2xl shadow-xl overflow-hidden ${theme === "dark"
      ? "bg-gradient-to-r from-gray-900 to-gray-950 text-white"
      : "bg-gradient-to-b from-gray-200 via-white to-gray-300 border border-gray-200 text-gray-900"
      }`}>
      <div className="absolute top-0 right-1 p-2  mt-5 ">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown();
          }}
          className="p-1"
        >
          <svg
            className="w-3 h-4 hover:h-[1.10rem]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 4 15"
          >
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className={`absolute z-10 right-0 mt-2 divide-y divide-gray-100 rounded-lg shadow w-fit ${theme === "dark" ? "bg-gray-700" : "bg-white border border-gray-200"}`}>
            <ul className={`py-1 text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
              <li>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setError(null);
                    setIsModalOpen(true);
                  }}
                  className={`block px-4 py-2 text-nowrap transition-colors ${theme === "dark" ? "hover:bg-gray-900 hover:text-white" : "hover:bg-gray-100"}`}
                >
                  Add to Playlist
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Modal for selecting playlist or creating a new one */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm flex justify-center items-center"
          onClick={(e) => e.preventDefault()}
        >
          <div className={`rounded-lg shadow-lg p-6 w-96 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900 border border-gray-200"}`}>
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsDropdownOpen(false);
              }}
              className="w-full text-sm text-end text-blue-500 hover:underline mb-2"
            >
              Close
            </button>

            <h2 className="text-lg font-semibold mb-4">Select Playlist</h2>

            {/* Dropdown to Select Playlist */}
            <div className="mb-4">
              {playlists.length === 0 ? (
                <div>No playlists found</div>
              ) : (
                <select
                  onChange={(e) => setSelectedPlaylistId(e.target.value)}
                  className={`w-full p-2 border rounded-md ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`}
                  size={5}
                >
                  {playlists?.map((playlist) => (
                    <option key={playlist?._id} value={playlist?._id}>
                      {playlist?.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Button to add video to selected playlist */}
            <button
              onClick={() => handleAddToPlaylist(selectedPlaylistId)}
              disabled={!selectedPlaylistId || loadingPlaylist}
              className="w-full p-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              {loadingPlaylist ? "Adding..." : "Add to Playlist"}
            </button>

            {/* New Playlist Form */}
            <h3 className="text-md font-medium mt-4 mb-2">
              Create New Playlist
            </h3>
            <div className="flex">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className={`w-10/12 p-2 border rounded-md mr-1 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                placeholder="Enter playlist name"
              />
              <button
                onClick={handleCreatePlaylist}
                disabled={loadingPlaylist}
                className={`w-2/12 text-white rounded-md disabled:opacity-50 text-xs font-light hover:font-normal ${loadingPlaylist ? "bg-transparent border" : "bg-blue-500"
                  }`}
              >
                {loadingPlaylist ? "Creating..." : "Create"}
              </button>
            </div>

            {/* Error Handling */}
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      )}
      <span className={`text-center font-bold text-2xl underline mt-6 ${theme === "dark" ? "text-white" : "text-gray-900"
        }`}>
        About Video
      </span>
      <div className={`font-bold my-3 mx-5 ${theme === "dark" ? "text-white" : "text-gray-900"
        }`}>
        {videoFile.title || "Untitled Video"}
      </div>
      <div className={`flex flex-col space-y-2 mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}>
        <span className="mx-5">{videoFile.views || 0} Views</span>
        <span className="mx-5">
          Uploaded Date: {formatDate(videoFile.createdAt)}
        </span>
      </div>

      <div className={`mt-3 mx-3 rounded-xl p-4 leading-relaxed text-sm max-h-44 overflow-auto ${theme === "dark"
        ? "bg-white/5 text-gray-300"
        : "bg-gray-200 text-gray-700"
        }`}>
        <span className="mb-1 text-center font-bold">Description: </span>
        {videoFile.description || "No description available."}
      </div>

      <div className={`absolute flex justify-between bottom-3 right-0 w-full h-[78px] border-t ${theme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}>
        <div className="flex">
          {owner ? (
            <>
              <Link className="self-center" to={`/profile/${owner?.username}`}>
                <img
                  className="w-12 h-12 self-center ml-3 rounded-full"
                  src={owner?.avatar || "default-avatar.png"}
                  alt="Owner Avatar"
                />
              </Link>
              <div className="flex flex-col ml-3 mt-3 max-w-28 ">
                <Link
                  to={`/profile/${owner?.username}`}
                  className="block max-w-full"
                >
                  <span className={`block max-w-full truncate mt-2 transition-colors ${theme === "dark" ? "hover:text-gray-300" : "hover:text-indigo-600"}`}>
                    {owner?.fullName || "Unknown User"}
                  </span>
                </Link>

                <span className="text-xs text-gray-500 leading-tight">
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
