function VideoComponent(video) {
  return (
    <div>
      <div className="w-64 max-h-32 center">
        <img
          className="object-cover max-h-40 min-w-60"
          src={video.thumbnail}
          alt={video.title}
        />
        <div className="flex flex-col">
          <span>{video.title}</span>
          <span className="">{video.views}</span>
        </div>
      </div>
    </div>
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
