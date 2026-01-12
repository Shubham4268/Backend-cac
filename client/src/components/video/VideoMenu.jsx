import { useSelector } from "react-redux";

function VideoMenu({ playlistId, handleRemoveFromPlaylist, openModal }) {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={`absolute z-50 right-5 top-3 divide-y divide-gray-100 rounded-lg shadow w-fit ${theme === "dark" ? "bg-gray-800" : "bg-white border text-gray-900 border-gray-200"}`}>
      <ul className={`py-1 text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
        <li>
          {playlistId ? (
            <button
              onClick={handleRemoveFromPlaylist}
              className={`block px-4 py-2 text-nowrap transition ${theme === "dark" ? "hover:bg-gray-900 hover:text-white" : "hover:bg-gray-100"}`}
            >
              Remove from Playlist
            </button>
          ) : (
            <button
              onClick={openModal}
              className={`block px-4 py-2 text-nowrap transition ${theme === "dark" ? "hover:bg-gray-900 hover:text-white" : "hover:bg-gray-100"}`}
            >
              Add to Playlist
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}

export default VideoMenu;
