import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import Header from "../Header/Header";

function Loader() {
  const isLoading = useSelector((state) => state.loader.isLoading);

  if (!isLoading) return null;

  return (
    <>
      {/* <Header /> */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
        {/* Loader card */}
        <div className="relative flex flex-col items-center gap-6 px-10 py-8 rounded-2xl bg-gray-900 border border-white/10 shadow-2xl">
          <FadeLoader color="#6366f1" />

          <p className="text-sm tracking-wide text-gray-300">Processing…</p>
        </div>
      </div>
    </>
  );
}

export default Loader;
