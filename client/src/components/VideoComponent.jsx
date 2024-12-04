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
  const to = `/video/:${video._id}`

  return (
    <Link to={to}>
      <div className="relative">
        <img
          className="object-cover rounded-lg h-44 w-full"
          src={video.thumbnail}
          alt={video.title}
        />
        <span className="absolute bottom-14 right-1 bg-gray-900 text-white text-sm px-3 py-1 rounded">
          {video.duration}:00
        </span>
        <div className="flex flex-col mt-2 mx-1">
          <span className="font-semibold">{video.title}</span>
          <div className="flex flex-row justify-between">
            <span className="text-sm text-gray-400">{video.views} views</span>
            <span className="text-sm text-gray-400">{getTimeDifference(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
    // <div>
    //   <a
    //     href="#"
    //     className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    //   >
    //     <img
    //       className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
    //       src={video.thumbnail}
    //       alt={video.title}
    //     />
    //     <div className="flex flex-col justify-between p-4 leading-normal">
    //       <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
    //         Noteworthy
    //       </h5>
    //       <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
    //         Here
    //       </p>
    //     </div>
    //   </a>
    // </div>
  );
}

export default VideoComponent;
