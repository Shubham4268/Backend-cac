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
  const [users, setUsers] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("videos"); // "videos" or "users"
  const [resultType, setResultType] = useState("videos"); // Which results to display
  const [error, setError] = useState(null);
  const notify = (text) => toast(text);
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.navbar.collapsed);
  const theme = useSelector((state) => state.theme.theme);

  // dispatch(setLoading(true));
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

  const fetchUsers = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users`,
        {
          withCredentials: true,
          params: {
            page: currentPage,
            limit,
            query,
          },
        }
      );

      const { success, data } = response.data;
      if (success) {
        setUsers(data.users || []);
        setTotalUsers(data.totalUsers || 0);
        setError(null);
      }
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const isNavbarToggle = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    isNavbarToggle.current = true;
    setLimit(collapsed ? 12 : 9);
  }, [collapsed]);

  useEffect(() => {
    if (isNavbarToggle.current) {
      isNavbarToggle.current = false;
      return;
    }
    // Fetch both videos and users for comprehensive search
    fetchVideos();
    if (query) {
      fetchUsers();
    }
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
        className={`flex flex-col items-center mt-24 mb-4 pt-6 w-full h-full transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-60"
        } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
      >
        <ToastContainer />

        {!error && (
          <div className="flex justify-end w-full mb-6 pr-8 gap-4">

            {/* ✅ Sort By */}
            <Select
              label="Sort by"
              value={sortBy}
              onChange={setSortBy}
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
              options={[
                { label: "Ascending", value: "asc" },
                { label: "Descending", value: "desc" },
              ]}
            />

          </div>
        )}

        {error && <p className="text-blue-500 text-center mb-5">{error}</p>}

        {/* Videos Grid */}
        {!error && resultType === "videos" && videos.length > 0 && (
          <div className={`grid gap-8 min-h-full w-full px-6 ${
            collapsed ? "grid-cols-4" : "grid-cols-3 "
          }`}>
            {videos?.map((video) => (
              <div
                key={video?._id}
                className={`max-w-xs mx-auto w-full ${
            collapsed ? "" : "scale-110 my-3"
          }`}>
                <VideoComponent videofile={video} notify={notify} />
              </div>
            ))}
          </div>
        )}

        {/* Users Grid */}
        {!error && resultType === "users" && users.length > 0 && (
          <div className={`grid gap-6 min-h-full w-full px-6 ${
            collapsed ? "grid-cols-4" : "grid-cols-3"
          }`}>
            {users?.map((user) => (
              <div
                key={user?._id}
                className="max-w-sm mx-auto w-full"
              >
                <UserCard user={user} />
              </div>
            ))}
          </div>
        )}

        {!error && videos.length > 0 && (
              <div className="mt-16 flex justify-center items-center gap-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePagination("prev")}
                  className="
                    px-4 py-2 rounded-xl bg-gray-900 border border-gray-800
                    hover:bg-gray-800 transition disabled:opacity-40
                  "
                >
                  Previous
                </button>

                <p className="text-gray-400 text-sm">
                  Page{" "}
                  <span className="text-white font-medium">{currentPage}</span>{" "}
                  of{" "}
                  <span className="text-white font-medium">
                    {Math.ceil(totalVideos / limit)}
                  </span>
                </p>

                <button
                  disabled={currentPage * limit >= totalVideos}
                  onClick={() => handlePagination("next")}
                  className="
                    px-4 py-2 rounded-xl bg-gray-900 border border-gray-800
                    hover:bg-gray-800 transition disabled:opacity-40
                  "
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
