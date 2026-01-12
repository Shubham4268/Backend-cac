import { useSelector } from "react-redux";

function SubscribeButton({ onclick, subscribed }) {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <button
      onClick={onclick}
      className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300
        ${
          subscribed
            ? theme === "dark"
              ? "bg-transparent border border-white/30 text-white hover:border-white"
              : "bg-transparent border border-gray-400 text-gray-800 hover:border-gray-700"
            : theme === "dark"
              ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-105"
              : "bg-red-500 text-white hover:bg-red-600 hover:shadow-md hover:scale-105"
        }`}
    >
      {subscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
}

export default SubscribeButton;
