import { Link } from "react-router-dom";

function PlaylistCard({ playlist }) {
  const currPlaylist = playlist || {};
  const { videos } = currPlaylist || [];
  const altUrl =
    "https://res.cloudinary.com/di52bqwk7/image/upload/v1736622079/zj2d0omk1ww2ls9moecm.jpg";
  return (
    <>
      <Link
        to={{
          pathname: `/playlists/${currPlaylist._id}`,
          state: { playlist: currPlaylist }, // Pass playlist as state
        }}
      >
        <div className="relative">
          <img
            className="object-cover rounded-lg h-44 w-full"
            src={videos?.length ? videos[0]?.thumbnail : altUrl}
            alt={currPlaylist?.name}
          />

          <span className="absolute top-36 right-1 bg-gray-900 text-white text-sm px-3 py-1 rounded">
            {videos?.length == 0
              ? "No videos"
              : videos?.length > 1
                ? `${videos?.length} videos`
                : `${videos?.length} video`}
          </span>
          <span className="text-lg font-semibold">{currPlaylist?.name}</span>
        </div>
      </Link>
    </>
  );
}

export default PlaylistCard;
