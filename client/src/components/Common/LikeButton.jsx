import { GrLike } from "react-icons/gr";

function LikeButton({ onclick, liked }) {
  return (
    <button onClick={onclick}>
      {liked ? (
        <div className="self-center border p-3 mr-3 rounded-full  bg-white shadow text-black  text-base border-black duration-100 hover:bg-white hover:shadow-2xl hover:text-lg hover:border-black">
          <GrLike/>
        </div>
      ) : (
        <div className="self-center border p-3 mr-3 rounded-full shadow hover:bg-white hover:shadow-2xl hover:text-black text-base hover:text-lg hover:border-black duration-300">
          <GrLike/>
        </div>
      )}
    </button>
  );
}

export default LikeButton;
