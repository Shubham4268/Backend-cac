import VideoComponent from "../components/VideoComponents/VideoComponent.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { handleApiError } from "../utils/errorHandler.js";
import Header from "../components/Header/Header.jsx";

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

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/videos", {
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
      }
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [currentPage, limit, sortBy, sortType, query]);

  const handleSearch = (e) => {
    const value = e?.target?.value || ""; // Ensure `value` is always defined
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
    <Header onSearch={handleSearch}/>
      <div className="flex flex-col items-center mt-24 mb-4 ml-56 pt-6 w-full h-full text-white">
        <div className="flex justify-between w-3/5 mb-6">
          <input
            type="text"
            placeholder="Search videos..."
            value={query}
            onChange={handleSearch}
            className="w-2/5 p-2 border border-gray-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-1/5 p-2 border border-gray-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Date</option>
            <option value="title">Title</option>
          </select>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="w-1/5 p-2 border border-gray-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-center mb-5">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 justify-items-center gap-4 min-h-full w-full">
          {videos?.map((video) => (
            <div
              key={video._id}
              className="p-2 items-center my-5 w-3/5 md:w-4/5 border border-gray-500 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <VideoComponent {...video} />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 w-1/2 ">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePagination("prev")}
            className="p-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-white">
            Page {currentPage} of {Math.ceil(totalVideos / limit)}
          </p>
          <button
            disabled={currentPage * limit >= totalVideos}
            onClick={() => handlePagination("next")}
            className="p-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
