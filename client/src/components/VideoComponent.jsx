
function VideoComponent(video) {
  

  return (
    <div>
      <div className="w-32 h-32">
        <img src={video.thumbnail} alt={video.title} />
      </div>
    </div>
  )
}

export default VideoComponent