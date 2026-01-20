import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

function PlaylistModal({
  playlists,
  selectedPlaylistId,
  setSelectedPlaylistId,
  handleAddToPlaylist,
  newPlaylistName,
  setNewPlaylistName,
  handleCreatePlaylist,
  loading,
  error,
  closeModal
}) {
  const [localError, setLocalError] = useState(null);
  const theme = useSelector((state) => state.theme.theme);

  const onCreateClick = () => {
    setLocalError(null);
    if (!newPlaylistName.trim()) {
      setLocalError("Playlist name is required");
      return;
    }
    if (newPlaylistName.length > 50) {
      setLocalError("Playlist name must be less than 50 characters");
      return;
    }
    handleCreatePlaylist();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      }}
    >
      <div
        className={`rounded-lg shadow-lg p-6 w-96 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900 border border-gray-200"}`}
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={closeModal}
          className="w-full text-sm text-end text-blue-500 hover:underline mb-2"
        >
          Close
        </button>

        <h2 className="text-lg font-semibold mb-4">Select Playlist</h2>

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

        <button
          onClick={() => handleAddToPlaylist(selectedPlaylistId)}
          disabled={!selectedPlaylistId || loading}
          className="w-full p-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add to Playlist"}
        </button>

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
            maxLength={50}
          />
          <button
            onClick={onCreateClick}
            disabled={loading}
            className={`w-2/12 text-white rounded-md disabled:opacity-50 text-xs font-light hover:font-normal ${loading ? "bg-transparent border" : "bg-blue-500"
              }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

        {error && <div className="text-red-500 mt-2">{error}</div>}
        {localError && <div className="text-red-500 mt-2">{localError}</div>}
      </div>
    </div>,
    document.body
  );
}

export default PlaylistModal;
