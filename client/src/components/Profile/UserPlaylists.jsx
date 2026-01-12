import { useEffect, useState } from "react";
import PlaylistCard from "../PlaylistCard";
import axios from "axios";
import { handleApiError } from "../../utils/errorHandler.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";

function UserPlaylists({ user }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const loggedInUser = useSelector((state) => state.user?.userData?.loggedInUser);
  const currUser = user;
  const isOwner = loggedInUser?._id === currUser?._id;

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/user/${currUser?._id}`
        );
        setPlaylists(response?.data?.data || []);
      } catch (error) {
        handleApiError(error, setError);
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (currUser?._id) fetchPlaylists();
  }, [currUser?._id]);

  return (
    <div className={`w-full px-6 py-10 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>

      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className={`text-3xl font-semibold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent" : "text-gray-900"}`}>
          {isOwner ? "Your Playlists" : `${currUser?.fullName}'s Playlists`}
        </h2>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm mt-1`}>
          {isOwner ? "Collections you’ve created and saved" : "Collections created by this user"}
        </p>
      </div>

      {/* Empty state */}
      {!playlists.length && (
        <div className="mt-24 flex flex-col items-center justify-center text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-5 ${theme === "dark" ? "bg-white/5 border border-white/10" : "bg-gray-100 border border-gray-200"}`}>
            🎧
          </div>
          <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
            No playlists yet
          </h3>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm mt-1 max-w-sm`}>
            Create playlists to organize your favorite videos and come back to them anytime.
          </p>
        </div>
      )}

      {/* Grid */}
      {!!playlists.length && (
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
          "
        >
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist?._id} playlist={playlist} />
          ))}
        </div>
      )}

    </div>
  );
}

export default UserPlaylists;
