function PlaylistCard() {
  return (
    <>
      <div className="relative">
        <img
          className="object-cover rounded-lg h-44 w-full"
          src=""
          alt=""
        />
         <span className="absolute top-36 right-1 bg-gray-900 text-white text-sm px-3 py-1 rounded">
          no. of vidoes
        </span>
        <span className="text-lg font-semibold">title</span>

      </div>
    </>
  );
}

export default PlaylistCard;
