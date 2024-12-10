import { Link } from "react-router-dom";

function VideoComponent(video) {
  const getTimeDifference = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMs = currentDate - createdDate; // Difference in milliseconds
    
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInYears = Math.floor(diffInDays / 365);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 365) {
      return `${diffInDays} days ago`;
    } else {
      return `${diffInYears} years ago`;
    }
  };

  const formatDuration = (durationInSeconds) => {
    
    const roundedSeconds = Math.round(durationInSeconds); // Round to the nearest whole second
    const minutes = Math.floor(roundedSeconds / 60); // Extract whole minutes
    const seconds = roundedSeconds % 60; // Remaining seconds
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  

  const to = `/video/${video?._id}`

  return (
    <Link to={to}>
      <div className="relative">
        <img
          className="object-cover rounded-lg h-44 w-full"
          src={video.thumbnail}
          alt={video.title}
        />
        <span className="absolute top-36 right-1 bg-gray-900 text-white text-sm px-3 py-1 rounded">
          {formatDuration(video.duration)}
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
