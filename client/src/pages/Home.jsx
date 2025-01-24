import VideoComponent from "../components/VideoComponents/VideoComponent.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { handleApiError } from "../utils/errorHandler.js";
import Header from "../components/Header/Header.jsx";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/slices/loaderSlice.js";
import { FcNext, FcPrevious } from "react-icons/fc";
axios.defaults.withCredentials = true;

function Home() {
  const [videos, setVideos] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const notify = (text) => toast(text);
  const dispatch = useDispatch();

  const fetchVideos = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/videos`, {
        withCredentials: true, // Include this in the same configuration object
        params: {
          page: currentPage,
          limit,
          sortBy,
          sortType,
          query,
        },
      });
      

      const { success, data } = response.data;
      if (success) {
        setVideos(data.videos);
        setTotalVideos(data.totalVideos);
        setError(null); // Reset error if the request is successful
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
    setCurrentPage(1); // Reset to first page for new queries
  };

  const handlePagination = (direction) => {
    setCurrentPage((prevPage) =>
      direction === "next" ? prevPage + 1 : prevPage - 1
    );
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="flex flex-col items-center mt-24 mb-4 ml-56 pt-6 w-full h-full text-white ">
        
        <ToastContainer />
        {!error && (
          <div className="flex justify-end w-full mb-6 space-x-6 mr-8">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-1/6 p-2 border border-gray-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Date</option>
              <option value="title">Title</option>
            </select>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="w-1/6 p-2 border border-gray-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        )}
        {error && <p className="text-blue-500 text-center mb-5">{error}</p>}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 justify-items-center gap-4 min-h-full w-full">
            {videos?.map((video) => (
              <div
                key={video?._id}
                className="p-2 items-center my-5 w-3/5 md:w-4/5 border border-gray-500 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800 "
              >
                <VideoComponent videofile={video} notify={notify} />
              </div>
            ))}
          </div>
        )}
        {!error && (
          <div className="mb-5 flex left-auto bottom-0 justify-between text-center items-center mt-4 w-1/2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePagination("prev")}
              className="p-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:hover:bg-gray-700 hover:bg-gray-800"
            >
              <FcPrevious className="text-xl "/>
            </button>
            <p className="text-white">
              Page {currentPage} of {Math.ceil(totalVideos / limit)}
            </p>
            <button
              disabled={currentPage * limit >= totalVideos}
              onClick={() => handlePagination("next")}
              className="p-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:hover:bg-gray-700 hover:bg-gray-800"
            >
              <FcNext className="text-xl"/>

            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
