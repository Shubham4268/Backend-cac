import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { handleApiError } from "../../utils/errorHandler";

function VideoComponent({ videofile, notify }) {
  const [showProfile, setShowProfile] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const location = useLocation();
  const video = videofile || {};
  const { owner } = video || {};

  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const {id : currPlaylistId}  = useParams();

  const getTimeDifference = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMs = currentDate - createdDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInMinutes < 60)
      return diffInMinutes < 2
        ? `${diffInMinutes} minute ago`
        : `${diffInMinutes} minutes ago`;
    if (diffInHours < 24)
      return diffInHours < 2
        ? `${diffInHours} hour ago`
        : `${diffInHours} hours ago`;
    if (diffInDays < 365)
      return diffInDays < 2
        ? `${diffInDays} day ago`
        : `${diffInDays} days ago`;
    return diffInYears < 2
      ? `${diffInYears} year ago`
      : `${diffInYears} years ago`;
  };

  // Format video duration
  const formatDuration = (durationInSeconds) => {
    const roundedSeconds = Math.round(durationInSeconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const seconds = roundedSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Fetch existing playlists when the component is mounted
  useEffect(() => {
    setError(null);
    if (location.pathname.includes("playlists")) {
      setPlaylistId(currPlaylistId);
    }

    if (
      ["profile", "playlists"].some((path) => location.pathname.includes(path))
    ) {
      setShowProfile(false);
    }

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
  }, [location.pathname, user?._id]);

  // Toggle the dropdown menu
  const toggleDropdown = () => setIsDropdownOpen((prevState) => !prevState);
  // Format time difference

  // Handle adding video to a selected playlist
  const handleAddToPlaylist = async (playlistId) => {
    try {
      // Make API call to add the video to the playlist
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/add/${video?._id}/${playlistId}`
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

  const handleRemoveFromPlaylist = async (e)=>{
    e.preventDefault()
      setError(null);
      setLoading(true)
       try {
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/remove/${video?._id}/${playlistId}`)

        if(response?.data?.success){
            notify("Video removed!!")
        }
       } catch (error) {
          handleApiError(error,setError)
       } finally{
        setLoading(false)
       }
    
  }

  // Handle creating a new playlist
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName) return;
    setLoading(true);
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
      setLoading(false);
      setError(null);
    }
  };



  const to = `/video/${video?._id}`;

  return (
    <Link to={to}>
      <div className="relative ">
        {/* Thumbnail */}
        <img
          className="object-cover rounded-lg h-44 w-full"
          src={video?.thumbnail}
          alt={video?.title}
        />
        {/* Video Duration */}
        <span className="absolute top-36 right-1 bg-gray-900 text-white text-sm px-3 py-1 rounded">
          {formatDuration(video?.duration)}
        </span>

        {/* Video Info */}
        <div className="flex relative">
          {showProfile && (
            <Link className="self-center" to={`/profile/${owner?.username}`}>
              <img
                src={owner?.avatar}
                alt={owner?.fullName}
                className="w-10 h-10 rounded-full mr-5 object-cover"
              />
            </Link>
          )}
          <div className="overflow-x-hidden text-nowrap overflow-ellipsis w-full mt-1">
            <span className="text-lg font-semibold">{video?.title}</span>

            <div className="flex flex-col">
              {showProfile && (
                <Link to={`/profile/${owner?.username}`}>
                  <span className="text-gray-400 text-sm hover:text-gray-300 hover:font-medium">
                    {owner?.fullName}
                  </span>
                </Link>
              )}
              <div className="flex flex-row justify-between w-full">
                <span className="text-sm text-gray-400">
                  {video?.views === 0
                    ? "no views yet"
                    : video?.views < 2
                      ? `${video?.views} View`
                      : `${video?.views} Views`}
                </span>
                <span className="text-gray-400 text-sm">
                  {getTimeDifference(video?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Three-Dot Menu */}
          <div className="absolute bottom-5 right-1">
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
                    {playlistId ? (
                      <button
                        onClick={handleRemoveFromPlaylist}
                        className="block px-4 py-2 text-nowrap hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:text-white"
                      >
                        Remove from Playlist
                      </button>
                    ) : (
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
                    )}
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
                      className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 "
                      size={5}
                    >
                      {playlists?.map((playlist) => (
                        <option key={playlist?._id} value={playlist?._id} className="hover:bg-gray-500 rounded-xl px-2 hover:cursor-pointer">
                          {playlist?.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Button to add video to selected playlist */}
                <button
                  onClick={() => handleAddToPlaylist(selectedPlaylistId)}
                  disabled={!selectedPlaylistId || loading}
                  className="w-full p-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add to Playlist"}
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
                    disabled={loading}
                    className={`w-2/12 text-white rounded-md disabled:opacity-50 text-xs font-light hover:font-normal ${
                      loading ? "bg-transparent border" : "bg-blue-500"
                    }`}
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>

                {/* Error Handling */}
                {error && <div className="text-red-500 mt-2">{error}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default VideoComponent;
