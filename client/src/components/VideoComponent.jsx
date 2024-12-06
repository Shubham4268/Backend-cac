import { Link } from "react-router-dom";

function VideoComponent(video) {
  const getTimeDifference = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMs = currentDate - createdDate; // Difference in milliseconds
    const diffInHours = diffInMs / (1000 * 60 * 60); // Convert to hours
  
    if (diffInHours >= 24) {
      const diffInDays = Math.floor(diffInHours / 24); // Convert to days
      return `${diffInDays} days ago`;
    } else {
      const hoursAgo = Math.floor(diffInHours);
      return `${hoursAgo} hours ago`;
    }
  };
  const to = `/video/${video._id}`

  return (
    <Link to={to}>
      <div className="relative">
        <img
          className="object-cover rounded-lg h-44 w-full"
          src={video.thumbnail}
          alt={video.title}
        />
        <span className="absolute top-36 right-1 bg-gray-900 text-white text-sm px-3 py-1 rounded">
          {video.duration}:00
        </span>
        <div className="flex flex-col mt-2 mx-1">
          <span className="font-semibold overflow-x-hidden text-nowrap overflow-ellipsis">{video.title}</span>
          <div className="flex flex-row justify-between">
            <span className="text-sm text-gray-400">
        {video.views === 0 ? "no views yet" : `${video.views} Views`}
      </span>
            <span className="text-sm text-gray-400">{getTimeDifference(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoComponent;
