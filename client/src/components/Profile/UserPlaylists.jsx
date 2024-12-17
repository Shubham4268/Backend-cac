import { useEffect, useState } from "react";
import PlaylistCard from "../PlaylistCard";
import axios from "axios";

function UserPlaylists({ user }) {
  const [playlists, setPlaylists] = useState([]);
  const currUser = user;

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/v1/playlists/user/${currUser?._id}`
      );
      setPlaylists(response?.data?.data);
    };

    fetchPlaylists();
  }, [currUser?._id]);

  return (
    <>
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
