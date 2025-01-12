export default function VideoFile({ video }) {
  const { videoFile: url = "", title = "No Title Available" } = video || {};

  return (
    <>
      <video className="object-contain w-full h-full rounded-xl  shadow-xl" controls autoPlay>
        <source src={url} type="video/mp4" />
        
      </video>
    </>
  );
}
