import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function PlaylistCard({ playlist }) {
  const currPlaylist = playlist || {};
  const { videos = [] } = currPlaylist;
  const theme = useSelector((state) => state.theme.theme);

  const altUrl =
    "https://res.cloudinary.com/di52bqwk7/image/upload/v1736622079/zj2d0omk1ww2ls9moecm.jpg";

  return (
    <Link
      to={`/playlists/${currPlaylist._id}`}
      className="group"
    >
      <div
        className={`
          rounded-2xl overflow-hidden
          transition
          ${theme === "dark"
            ? "border border-white/10 bg-white/5 backdrop-blur hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            : "border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-blue-300"
          }
        `}
      >
        {/* Thumbnail */}
        <div className={`relative aspect-video overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>

          <img
            src={videos.length ? videos[0]?.thumbnail : altUrl}
            alt={currPlaylist?.name}
            className="
              w-full h-full object-cover
              group-hover:scale-110 transition duration-500
            "
          />

          {/* Dark overlay - kept in both themes for text readability over image if needed, but mainly for style */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />


        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className={`text-sm font-semibold line-clamp-2 transition ${theme === "dark" ? "text-gray-100 group-hover:text-white" : "text-gray-800 group-hover:text-blue-600"}`}>
            {currPlaylist?.name}
          </h3>
          <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
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
