import { useSelector } from "react-redux";

function VideoMenu({ playlistId, handleRemoveFromPlaylist, openModal, isOwner, onEdit, onDelete }) {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={`absolute z-50 right-0 mt-2 top-full rounded-lg shadow-lg min-w-[170px] overflow-hidden ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200 text-gray-900"}`}>
      <ul className={`py-1 text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
        {isOwner && (
          <>
            <li className="w-full">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
                className={`w-full text-left px-4 py-2 transition ${theme === "dark" ? "hover:bg-gray-800 hover:text-white" : "hover:bg-gray-100"}`}
              >
                Edit Video
              </button>
            </li>
            <li className="w-full">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                className={`w-full text-left px-4 py-2 transition text-red-500 font-medium ${theme === "dark" ? "hover:bg-gray-800 text-red-400" : "hover:bg-gray-100 text-red-600"}`}
              >
                Delete Video
              </button>
            </li>
          </>
        )}
        <li className="w-full border-t border-gray-100 dark:border-gray-700">
          {playlistId ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveFromPlaylist(e);
              }}
              className={`w-full text-left px-4 py-2 transition ${theme === "dark" ? "hover:bg-gray-800 hover:text-white" : "hover:bg-gray-100"}`}
            >
              Remove from Playlist
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(e);
              }}
              className={`w-full text-left px-4 py-2 transition ${theme === "dark" ? "hover:bg-gray-800 hover:text-white" : "hover:bg-gray-100"}`}
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
