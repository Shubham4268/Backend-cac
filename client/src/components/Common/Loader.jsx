import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import Header from "../Header/Header";

function Loader() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const theme = useSelector((state) => state.theme.theme);

  if (!isLoading) return null;

  return (
    <>
      {/* <Header /> */}
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={`fixed inset-0 z-[9999] flex items-center justify-center
  transition-opacity duration-200
  ${theme === "dark"
            ? "bg-black/40 backdrop-blur-sm"
            : "bg-white/60 backdrop-blur-sm"}`}
      >
        <div
          className={`relative flex flex-col items-center gap-4 px-10 py-8 rounded-2xl border shadow-2xl
    ${theme === "dark"
              ? "bg-gray-900 border-white/10"
              : "bg-white border-gray-100"}`}
        >
          <FadeLoader color={theme === "dark" ? "#6366f1" : "#4f46e5"} />
          <p className={`text-sm tracking-wide animate-pulse
      ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Processing…
          </p>
        </div>
      </div>

    </>
  );
}

export default Loader;
