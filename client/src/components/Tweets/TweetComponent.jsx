import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { change } from "../../features/slices/tweetSlice";
import { handleApiError } from "../../utils/errorHandler";
import { toast, ToastContainer } from "react-toastify";

function TweetComponent({ tweet, tweetData, refreshTweets }) {
  const [error, setError] = useState(null);
  const usersTweetData = tweetData;
  const userTweet = tweet;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = (text) => toast(text);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); // For confirmation modal state

  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const theme = useSelector((state) => state.theme.theme);
  const isCurrentUser = user?._id === usersTweetData._id;

  const onEdit = () => {
    dispatch(change(tweet))
    navigate("/addTweet")
  }

  const onDelete = async () => {
    try {
      const deletedTweet = await axios.delete(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/tweets/${userTweet?._id}`);
      if (deletedTweet?.data?.success) {
        refreshTweets();  // Call the refreshTweets function to refresh the list of tweets
        notify("Tweet Deleted");
      }
    } catch (error) {
      handleApiError(error, setError);
    }
  };


  const formatDate = (date) => {
    if (!date) return "Unknown Date";
    const now = new Date(date);
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const confirmDelete = () => {
    setIsConfirmingDelete(true); // Show confirmation modal
    toggleDropdown(); // Close the dropdown
  };

  const cancelDelete = () => {
    setIsConfirmingDelete(false); // Hide the confirmation modal
  };


  return (
    <div className="flex flex-col w-5/6 m-auto h-fit px-5 pb-5 rounded-lg">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <ToastContainer />
      <div className="flex justify-between mt-5">
        <div className="flex self-start">
          <img
            src={usersTweetData.avatar}
            alt={usersTweetData.fullName}
            className="w-8 h-8 rounded-full mr-3 object-cover"
          />
          <span className="self-center">{usersTweetData.fullName}</span>
        </div>
        <div className="flex text-sm items-center relative">
          <span className={`${!isCurrentUser && "mr-7"}`}>{formatDate(userTweet.createdAt)}</span>
          {isCurrentUser && (
            <div>
              <button
                onClick={toggleDropdown}
                className={`inline-flex ml-4 p-2 text-sm font-medium rounded-full ${theme === "dark" ? "text-white hover:bg-gray-800" : "text-gray-900 hover:bg-gray-100"}`}
                type="button"
              >
                <svg
                  className="w-3 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 4 15"
                >
                  <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className={`absolute z-10 right-5 divide-y divide-gray-100 rounded-lg shadow w-20 ${theme === "dark" ? "bg-gray-800" : "bg-white border border-gray-200"}`}>
                  <ul className={`py-2 text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    <li>
                      <a
                        onClick={onEdit}
                        href="#"
                        className={`block px-4 py-2 ${theme === "dark" ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100"}`}
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={confirmDelete}
                        className={`block px-4 py-2 cursor-pointer ${theme === "dark" ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100"}`}
                      >
                        Delete
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isConfirmingDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className={`p-5 rounded-lg w-1/3 border shadow-2xl ${theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
            <h3 className="text-xl mb-4">Are you sure you want to delete this tweet?</h3>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className={`px-4 py-2 rounded-md ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
              >
                Cancel
              </button>
              <button
                onClick={onDelete} // Proceed with deletion
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {<div className={`ml-5 mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        {userTweet?.content}
      </div>}
    </div>
  );
}

export default TweetComponent;
