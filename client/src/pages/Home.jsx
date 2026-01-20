import VideoComponent from "../components/video/VideoComponent.jsx";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { handleApiError } from "../utils/errorHandler.js";
import Header from "../components/Header/Header.jsx";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/slices/loaderSlice.js";
import { useSelector } from "react-redux";
import { FcNext, FcPrevious } from "react-icons/fc";
import Select from "../components/ui/Select.jsx"; // ✅ added
import { Loader } from "../components/index.js";

axios.defaults.withCredentials = true;

function Home() {
  const [videos, setVideos] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const collapsed = useSelector((state) => state.navbar.collapsed);
  // Limit 12 works for both 3-col (expanded) and 4-col (collapsed) layouts
  const [limit, setLimit] = useState(12);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const notify = (text) => toast(text);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const fetchVideos = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/videos`,
        {
          withCredentials: true,
          params: {
            page: currentPage,
            limit,
            sortBy,
            sortType,
            query,
          },
        }
      );

      const { success, data } = response.data;
      if (success) {
        setVideos(data.videos);
        setTotalVideos(data.totalVideos);
        setError(null);
      } else if (data.videos.length === 0) {
        setError("No results found.");
      }
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [currentPage, limit, sortBy, sortType, query]);

  const handleSearch = (e) => {
    const value = e?.target?.value || "";
    setQuery(value);
    setCurrentPage(1);
  };

  const handlePagination = (direction) => {
    setCurrentPage((prevPage) =>
      direction === "next" ? prevPage + 1 : prevPage - 1
    );
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <Loader />
      <div
        className={`flex flex-col items-center mt-24 mb-4 pt-6 w-full h-full transition-all duration-300 
          ${collapsed ? "md:ml-16" : "md:ml-60"} 
          ${theme === "dark" ? "text-white" : "text-gray-900"}`}
      >
        <ToastContainer />

        {!error && (
          <div className="flex flex-row justify-end w-full mb-6 px-4 sm:pr-8 gap-2 sm:gap-4">

            {/* ✅ Sort By */}
            <Select
              label="Sort by"
              value={sortBy}
              onChange={setSortBy}
              className="w-32 sm:w-44"
              options={[
                { label: "Date", value: "createdAt" },
                { label: "Title", value: "title" },
              ]}
            />

            {/* ✅ Sort Order */}
            <Select
              label="Order"
              value={sortType}
              onChange={setSortType}
              className="w-32 sm:w-44"
              options={[
                { label: "Ascending", value: "asc" },
                { label: "Descending", value: "desc" },
              ]}
            />

          </div>
        )}

        {error && <p className="text-blue-500 text-center mb-5">{error}</p>}

        {/* Videos Grid */}
        {!error && videos.length > 0 && (
          <div
            key={`${currentPage}-${sortBy}-${sortType}-${query}-${limit}`}
            className={`grid gap-8 min-h-full w-full px-4 sm:px-6 
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${collapsed ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {videos?.map((video, index) => (
              <div
                key={video?._id}
                className={`max-w-xs mx-auto w-full transition-transform hover:scale-105 duration-300 animate-slide-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <VideoComponent videofile={video} notify={notify} />
              </div>
            ))}
          </div>
        )}

        {!error && videos.length > 0 && (
          <div className="mt-16 flex justify-center items-center gap-6">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePagination("prev")}
              className={`
                      px-4 py-2 rounded-xl border transition disabled:opacity-40
                      ${theme === "dark"
                  ? "bg-gray-900 border-gray-800 hover:bg-gray-800 text-white"
                  : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
                }
                    `}
            >
              Previous
            </button>

            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm`}>
              Page{" "}
              <span className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-medium`}>{currentPage}</span>{" "}
              of{" "}
              <span className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-medium`}>
                {Math.ceil(totalVideos / limit)}
              </span>
            </p>

            <button
              disabled={currentPage * limit >= totalVideos}
              onClick={() => handlePagination("next")}
              className={`
                      px-4 py-2 rounded-xl border transition disabled:opacity-40
                      ${theme === "dark"
                  ? "bg-gray-900 border-gray-800 hover:bg-gray-800 text-white"
                  : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
                }
                    `}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
