import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { X, ListMusic, Plus, Loader2, Check } from "lucide-react";

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
  const isDark = theme === "dark";

  const onCreateClick = (e) => {
    e.preventDefault();
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

  const onPlaylistSelect = (id) => {
    setSelectedPlaylistId(id);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex justify-center items-center px-4 overflow-hidden"
      onClick={closeModal}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 overflow-hidden backdrop-blur-sm"></div>

      <div
        className={`relative w-full max-w-md p-6 rounded-2xl shadow-xl transition-all duration-300 animate-slide-up
          ${isDark 
            ? "bg-gray-900 border border-gray-700 text-white" 
            : "bg-white border border-gray-200 text-gray-900"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            Save to playlist
          </h2>
          <button
            onClick={closeModal}
            className={`p-1 rounded-full transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Playlists List */}
        <div className="max-h-[250px] overflow-y-auto pr-1 space-y-1 mb-6">
          {playlists.length === 0 ? (
            <div className="py-8 text-center opacity-50 text-sm italic">
              No playlists found.
            </div>
          ) : (
            playlists?.map((playlist) => {
              const isActive = selectedPlaylistId === playlist?._id;
              return (
                <button
                  key={playlist?._id}
                  onClick={() => onPlaylistSelect(playlist?._id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? isDark ? "bg-gray-700 text-blue-400" : "bg-blue-50 text-blue-600"
                      : isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <ListMusic className={`w-4 h-4 ${isActive ? "text-blue-500" : "opacity-40"}`} />
                    <span className="text-sm">{playlist?.name}</span>
                  </div>
                  {isActive && <Check className="w-4 h-4" />}
                </button>
              );
            })
          )}
        </div>

        {/* Add Actions */}
        <button
          onClick={() => handleAddToPlaylist(selectedPlaylistId)}
          disabled={!selectedPlaylistId || loading}
          className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all mb-6
            ${!selectedPlaylistId 
              ? "bg-gray-500/20 text-gray-500 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95"
            }`}
        >
          {loading ? "Adding..." : "Add to Playlist"}
        </button>

        {/* Create New Section */}
        <div className={`pt-6 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <h3 className="text-xs font-semibold mb-3 opacity-60 uppercase tracking-wider">
            Create New Playlist
          </h3>
          <form className="flex gap-2" onSubmit={onCreateClick}>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className={`flex-1 px-3 py-2 text-sm rounded-lg outline-none border transition-all
                ${isDark 
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" 
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                }`}
              placeholder="Enter name..."
            />
            <button
              type="submit"
              disabled={loading || !newPlaylistName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </button>
          </form>
        </div>

        {/* Error Messages */}
        {(error || localError) && (
          <p className="text-red-400 text-[10px] italic font-medium mt-4 ml-1 flex items-center gap-1">
            <X className="w-3 h-3" /> {error || localError}
          </p>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? "#ffffff10" : "#00000010"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? "#ffffff20" : "#00000020"};
        }
      `}</style>
    </div>,
    document.body
  );
}

export default PlaylistModal;
