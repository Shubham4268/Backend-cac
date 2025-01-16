import { useEffect, useState } from "react";
import PlaylistCard from "../PlaylistCard";
import axios from "axios";
import { handleApiError } from "../../utils/errorHandler.js";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/slices/loaderSlice.js";

function UserPlaylists({ user }) {
  const dispatch = useDispatch();
  const [playlists, setPlaylists] = useState([]);
  const currUser = user;
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/playlists/user/${currUser?._id}`
        );
        setPlaylists(response?.data?.data);
      } catch (error) {
        handleApiError(error, setError);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPlaylists();
  }, [currUser?._id]);

  return (
    <>
      
      {!playlists.length && (
        <div className="mt-20 w-full text-center text-3xl font-bold">
          No Playlists yet
        </div>
      )}
      <div className="grid grid-cols-4 justify-items-center gap-2 min-h-full w-full">
        {playlists?.map((playlist) => (
          <div
            key={playlist?._id}
            className="p-2 items-center my-5 w-3/5 md:w-4/5 border border-gray-500 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800 "
          >
            <PlaylistCard playlist={playlist} />
          </div>
        ))}
      </div>
    </>
  );
}

export default UserPlaylists;
