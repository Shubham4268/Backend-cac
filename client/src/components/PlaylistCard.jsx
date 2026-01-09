import { Link } from "react-router-dom";

function PlaylistCard({ playlist }) {
  const currPlaylist = playlist || {};
  const { videos = [] } = currPlaylist;

  const altUrl =
    "https://res.cloudinary.com/di52bqwk7/image/upload/v1736622079/zj2d0omk1ww2ls9moecm.jpg";

  return (
    <Link
      to={`/playlists/${currPlaylist._id}`}
      className="group"
    >
      <div
        className="
          rounded-2xl overflow-hidden
          border border-white/10
          bg-white/5 backdrop-blur
          hover:border-white/20
          hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]
          transition
        "
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-900">

          <img
            src={videos.length ? videos[0]?.thumbnail : altUrl}
            alt={currPlaylist?.name}
            className="
              w-full h-full object-cover
              group-hover:scale-110 transition duration-500
            "
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-100 line-clamp-2 group-hover:text-white transition">
            {currPlaylist?.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {videos.length === 0
              ? "No videos"
              : videos.length === 1
              ? "1 video"
              : `${videos.length} videos`}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default PlaylistCard;
