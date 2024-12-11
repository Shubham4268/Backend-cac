import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { handleApiError } from "../utils/errorHandler";

function TweetComponent({ tweet, tweetData, handleDelete }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(null);
  const usersTweetData = tweetData;
  const userTweet = tweet;

  const user = useSelector((state) => state.user?.userData?.loggedInUser);
  const isCurrentUser = user?._id === usersTweetData._id;
  const onDelete = handleDelete(userTweet);
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

  return (
    <div className="flex flex-col w-5/6 m-auto h-fit border border-1 bg-gray-800 px-5 pb-5 rounded-lg">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex justify-between mt-5">
        <div className="flex self-start">
          <img
            src={usersTweetData.avatar}
            alt={usersTweetData.fullName}
            className="w-8 h-8 rounded-full mr-3"
          />
          <span className="self-center">{usersTweetData.fullName}</span>
        </div>
        <div className="flex text-sm items-center relative">
          <span>{formatDate(usersTweetData.createdAt)}</span>
          {isCurrentUser && (
            <div>
              <button
                onClick={toggleDropdown}
                className="inline-flex p-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:bg-gray-100 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-800"
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
                <div className="absolute z-10 right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-20 dark:bg-gray-700">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={onDelete}
                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
      <div className="text-white ml-5 mt-2">
        {/* <form onSubmit><input type="text" /></form> */}
        {userTweet?.content}
      </div>
    </div>
  );
}

export default TweetComponent;
