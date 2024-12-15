import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function VideoComponent(video) {
  const [showProfile, setShowProfile] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getTimeDifference = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMs = currentDate - createdDate; // Difference in milliseconds

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return diffInMinutes < 2
        ? `${diffInMinutes} minute ago`
        : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours < 2
        ? `${diffInHours} hour ago`
        : `${diffInHours} hours ago`;
    } else if (diffInDays < 365) {
      return diffInDays < 2
        ? `${diffInDays} day ago`
        : `${diffInDays} days ago`;
    } else {
      return diffInYears < 2
        ? `${diffInYears} year ago`
        : `${diffInYears} years ago`;
    }
  };

  const formatDuration = (durationInSeconds) => {
    const roundedSeconds = Math.round(durationInSeconds); // Round to the nearest whole second
    const minutes = Math.floor(roundedSeconds / 60); // Extract whole minutes
    const seconds = roundedSeconds % 60; // Remaining seconds
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const location = useLocation();
  const { owner } = video;

  useEffect(() => {
    if (location.pathname.includes("profile")) {
      setShowProfile(false);
    }
  }, [location.pathname]);

  const to = `/video/${video?._id}`;
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handlePlaylist = async () => {
    const response = await axios.post(``)
  }

  return (
    <Link to={to}>
      <div className="relative">
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
                className="w-10 h-10 rounded-full mr-5"
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
              className="p-1 "
            >
              <svg
                  className="w-3 h-4  hover:h-[1.10rem]"
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
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200 ">
                  <li>
                    <a
                      onClick={handlePlaylist}
                      className="block px-4 py-2 text-nowrap hover:bg-gray-100 dark:hover:bg-gray-900  dark:hover:text-white"
                    >
                      Add to Playlist
                    </a>
                  </li>
                 
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoComponent;
