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
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchChannelStats = async () => {
      if (!owner?._id) return; // Avoid API call if owner or _id is missing

      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/dashboards/stats/${owner._id}`
        );

        const { data: info } = response || {};
        const { data } = info || {};
        const { getTotalSubscribers } = data || 0;
        const { subscribedStatus } = data || null;
        setSubscribers(getTotalSubscribers);
        setSubscribed(subscribedStatus);
        const likeResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/likes/v/${videoFile._id}`
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
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/user/${user?._id}`
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
      `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/likes/toggle/v/${videoFile._id}`
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
      `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/subscriptions/c/${channelId}`
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
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/add/${videoFile?._id}/${playlistId}`
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
    <div className="relative flex flex-col shadow-lg h-full my-3">
      <div className="absolute top-0 right-1 p-2">
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

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute z-10 right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-fit dark:bg-gray-700">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setError(null);
                    setIsModalOpen(true);
                  }}
                  className="block px-4 py-2 text-nowrap hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:text-white"
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
          className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={(e) => e.preventDefault()}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 dark:bg-gray-800 dark:text-white">
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
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
                className="w-10/12 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 mr-1"
                placeholder="Enter playlist name"
              />
              <button
                onClick={handleCreatePlaylist}
                disabled={loadingPlaylist}
                className={`w-2/12 text-white rounded-md disabled:opacity-50 text-xs font-light hover:font-normal ${
                  loadingPlaylist ? "bg-transparent border" : "bg-blue-500"
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
              <Link className="self-center" to={`/profile/${owner?.username}`}>
                <img
                  className="w-14 h-14 self-center ml-3 rounded-full"
                  src={owner?.avatar || "default-avatar.png"}
                  alt="Owner Avatar"
                />
              </Link>
              <div className="flex flex-col ml-3 mt-3">
                <Link to={`/profile/${owner?.username}`}>
                  <span className=" hover:text-gray-300 ">
                    {owner?.fullName || "Unknown User"}
                  </span>
                </Link>

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
