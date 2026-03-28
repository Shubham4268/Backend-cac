import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Play, ListMusic } from "lucide-react";

function PlaylistCard({ playlist }) {
  const currPlaylist = playlist || {};
  const { videos = [] } = currPlaylist;
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  const altUrl =
    "https://res.cloudinary.com/di52bqwk7/image/upload/v1736622079/zj2d0omk1ww2ls9moecm.jpg";

  return (
    <Link
      to={`/playlists/${currPlaylist._id}`}
      className="group block relative"
    >
      {/* Stacked background effect for collection feel */}
      <div className={`absolute -right-2 -top-2 w-full h-full rounded-2xl transition-all duration-300 group-hover:-right-3 group-hover:-top-3 
        ${isDark ? "bg-white/5 border border-white/5" : "bg-gray-200 border border-gray-300"}`} />
      
      <div
        className={`
          relative rounded-2xl overflow-hidden
          transition-all duration-300
          ${isDark
            ? "border border-white/10 bg-slate-900 shadow-2xl group-hover:border-indigo-500/50"
            : "border border-gray-200 bg-white shadow-md group-hover:border-indigo-400 group-hover:shadow-xl"
          }
        `}
      >
        {/* Thumbnail Wrapper */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={videos.length ? (videos[0]?.thumbnail || videos[0]?.videoFile?.thumbnail) : altUrl}
            alt={currPlaylist?.name}
            className="
              w-full h-full object-cover
              group-hover:scale-110 transition duration-700
            "
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Video Count Badge */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white">
            <ListMusic className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {videos.length} {videos.length === 1 ? "Video" : "Videos"}
            </span>
          </div>

          {/* Hover Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-4 rounded-full bg-indigo-600 text-white shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
               <Play className="w-6 h-6 fill-current" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className={`text-sm font-bold line-clamp-1 mb-1 transition-colors duration-300
            ${isDark ? "text-gray-100 group-hover:text-indigo-400" : "text-gray-900 group-hover:text-indigo-600"}`}>
            {currPlaylist?.name}
          </h3>
          
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
            <span>Playlist</span>
            <span className="flex items-center gap-1">
               View all
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PlaylistCard;
