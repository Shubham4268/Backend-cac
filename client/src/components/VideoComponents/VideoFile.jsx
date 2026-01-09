export default function VideoFile({ video }) {
  const { videoFile: url = "" } = video || {};

  return (
    <video
      className="w-full h-full object-contain bg-black "
      controls
      autoPlay
      controlsList="nodownload"
      loop
    >
      <source src={url} type="video/mp4" />
    </video>
  );
}
