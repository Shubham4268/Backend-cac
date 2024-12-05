function VideoDetails({ video }) {
  const videoFile = video || {};
  console.log(videoFile);

  return (
    <div className="flex flex-col  my-3">
      <span className="text-center font-bold text-2xl underline mb-2 ">
        About Video
      </span>
      <div className="font-bold my-3 mx-5">{videoFile.title}</div>
      <div className="flex flex-col border border-gray-500  bg-gray-700 rounded-lg shadow mx-3 p-2 h-28 max-h-28">
        <span >Description :</span>
        <span className="overflow-auto no-scrollbar p-1 rounded-lg">I WAS THE ONE WHO GOT TRICKED I WAS THE ONE WHO GOT TRICKEDI WAS THE ONE WHO GOT TRICKED I WAS THE ONE WHO GOT TRICKEDI WAS THE ONE WHO GOT TRICKED I WAS THE ONE WHO GOT TRICKED</span>
      </div>
      {/* <span className="mx-5">{videoFile.createdAt}</span>
      <span className="mx-5">{videoFile.duration}</span>
      <span className="mx-5">{videoFile.owner}</span>
      <span className="mx-5">{videoFile.views}</span>
      <span className="mx-5">{videoFile.createdAt}</span> */}
    </div>
  );
}

export default VideoDetails;
