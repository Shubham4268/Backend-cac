import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ProfileDropdown({ user }) {
  const currUser = user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative mt-2" ref={dropdownRef}>
      <button
        id="dropdownUserAvatarButton"
        onClick={toggleDropdown}
        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={currUser?.avatar}
          alt="user photo"
        />
      </button>

      {isDropdownOpen && (
        <div
          id="dropdownAvatar"
          className="absolute right-1 mt-1.5 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>{currUser?.fullName}</div>
            <div className="font-medium truncate">{currUser?.email}</div>
          </div>
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownUserAvatarButton"
          >
            <li>
              <Link
                to={"/update-account"}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Update Details
              </Link>
            </li>
            <li>
              <Link
                to={"/change-password"}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Change Password
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
