import { GrLike } from "react-icons/gr";
import { useSelector } from "react-redux";

function LikeButton({ onclick, liked }) {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <button onClick={onclick} aria-pressed={liked}>
      <div
        className={`self-center mr-3 p-3 rounded-full border transition-all duration-200 
        flex items-center justify-center
        ${
          liked
            ? theme === "dark"
              ? "bg-white text-black border-white shadow-lg scale-105"
              : "bg-white text-black border-black shadow-lg scale-105"
            : theme === "dark"
              ? "bg-gray-900 text-gray-300 border-gray-700 hover:bg-white hover:text-black hover:shadow-xl"
              : " text-gray-700 border-gray-700 hover:bg-white hover:text-black hover:shadow-xl"
        }`}
      >
        <GrLike className="text-base" />
      </div>
    </button>
  );
}

export default LikeButton;
