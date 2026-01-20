import axios from "axios";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { handleApiError } from "../../utils/errorHandler";
import { setNavbarCollapsed } from "../../features/slices/navbarSlice";

import VideoMenu from "./VideoMenu";
import PlaylistModal from "./PlaylistModal";
import { getTimeDifference, formatDuration } from "../../utils/time";

function VideoComponent({ videofile, notify }) {
  const [showProfile, setShowProfile] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const location = useLocation();
  const video = videofile || {};
  const { owner } = video || {};

  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const theme = useSelector((state) => state.theme.theme);
  const { id: currPlaylistId } = useParams();

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
      if (!user?._id) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/user/${user?._id}`
        );

        setPlaylists(response?.data?.data || []);
      } catch (err) {
        setError(err.message || "Failed to load playlists");
      }
    };
    fetchPlaylists();
  }, [location.pathname, user?._id, currPlaylistId]);

  const toggleDropdown = useCallback(() => setIsDropdownOpen((p) => !p), []);
  const handleDotsClick = useCallback((e) => {
    e?.preventDefault?.();
    toggleDropdown();
  }, [toggleDropdown]);

  const openModal = useCallback((e) => {
    e?.preventDefault?.();
    setError(null);
    setIsModalOpen(true);
  }, []);

  const handleAddToPlaylist = useCallback(async (playlistId) => {
    if (!playlistId) return;
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/add/${video?._id}/${playlistId}`
      );

      const message =
        response?.data?.message || "Video added to playlist successfully!";

      setIsModalOpen(false);
      setIsDropdownOpen(false);

      notify(message);
    } catch (err) {
      console.error("Error adding video to playlist:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to add video to playlist"
      );
    }
  }, [video?._id, notify]);

  const handleRemoveFromPlaylist = useCallback(async (e) => {
    e?.preventDefault?.();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/remove/${video?._id}/${playlistId}`
      );

      if (response?.data?.success) {
        notify("Video removed!!");
      }
    } catch (err) {
      handleApiError(err, setError);
    } finally {
      setLoading(false);
    }
  }, [playlistId, video?._id, notify]);

  const handleCreatePlaylist = useCallback(async () => {
    if (!newPlaylistName) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/`,
        { name: newPlaylistName }
      );
      if (response?.data?.success) {
        setPlaylists((prev) => [...prev, response?.data?.data]);

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
  }, [newPlaylistName, handleAddToPlaylist, notify]);

  const dispatch = useDispatch();
  const to = `/video/${video?._id}`;

  const handleVideoClick = () => {
    dispatch(setNavbarCollapsed(true));
  };

  const formattedDuration = useMemo(
    () => formatDuration(video?.duration),
    [video?.duration]
  );
  const timeAgo = useMemo(
    () => getTimeDifference(video?.createdAt),
    [video?.createdAt]
  );

  return (
    <Link to={to} className="group" onClick={handleVideoClick}>
      <div className={`
      relative rounded-2xl overflow-hidden
      shadow-lg hover:shadow-2xl
      transition-all duration-300
      ${theme === "dark" ? "bg-gray-800" : "bg-white border border-gray-200 shadow-lg"}
    `}>

        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            loading="lazy"
            className="object-contain bg-black  w-full h-full group-hover:scale-105 transition-transform duration-500"
            src={video?.thumbnail}
            alt={video?.title || "video thumbnail"}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

          {/* Duration */}
          <span className="
          absolute bottom-2 right-2 
          bg-black/80 backdrop-blur px-2.5 py-1 rounded-lg
          text-xs font-medium text-white tracking-wide
        ">
            {formattedDuration}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex gap-3">

          {/* Avatar */}
          {showProfile && (
            <Link to={`/profile/${owner?.username}`} onClick={(e) => e.stopPropagation()}>
              <img
                src={owner?.avatar}
                alt={owner?.fullName}
                className="
                w-10 h-10 rounded-full object-cover
                hover:scale-105 transition
              "
              />
            </Link>
          )}

          {/* Text */}
          <div className="flex-1 min-w-0">

            <p className={`
            font-semibold leading-snug line-clamp-2
            group-hover:text-blue-400 transition
            ${theme === "dark" ? "text-white" : "text-gray-900"}
          `}>
              {video?.title}
            </p>

            {showProfile && (
              <Link
                to={`/profile/${owner?.username}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-block mt-1"
              >
                <p className={`text-sm max-w-48 truncate  hover:text-gray-300 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                  {owner?.fullName}
                </p>
              </Link>
            )}

            <div className={`flex items-center gap-2 text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}>
              <span>
                {video?.views === 0
                  ? "no views"
                  : video?.views < 2
                    ? `${video?.views} view`
                    : `${video?.views} views`}
              </span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>

          {/* Menu */}
          <div className="relative self-start">
            <button
              onClick={handleDotsClick}
              className={`
              p-1.5 rounded-full transition
              ${theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }
            `}
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 4 15"
              >
                <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
            </button>

            {isDropdownOpen && (
              <VideoMenu
                playlistId={playlistId}
                handleRemoveFromPlaylist={handleRemoveFromPlaylist}
                openModal={openModal}
              />
            )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <PlaylistModal
            playlists={playlists}
            selectedPlaylistId={selectedPlaylistId}
            setSelectedPlaylistId={setSelectedPlaylistId}
            handleAddToPlaylist={handleAddToPlaylist}
            newPlaylistName={newPlaylistName}
            setNewPlaylistName={setNewPlaylistName}
            handleCreatePlaylist={handleCreatePlaylist}
            loading={loading}
            error={error}
            closeModal={() => {
              setIsModalOpen(false);
              setIsDropdownOpen(false);
            }}
          />
        )}
      </div>
    </Link>
  );

}

export default React.memo(VideoComponent);
