function VideoMenu({ playlistId, handleRemoveFromPlaylist, openModal }) {
  return (
    <div className="absolute z-50 right-5 top-3 bg-white divide-y divide-gray-100 rounded-lg shadow w-fit dark:bg-gray-700">
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
              onClick={openModal}
              className="block px-4 py-2 text-nowrap hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:text-white"
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
