import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { User, KeyRound, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

function ProfileDropdown({ user }) {
  const currUser = user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const theme = useSelector((state) => state.theme.theme);

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
      {/* Avatar Button */}
      <button
        id="dropdownUserAvatarButton"
        onClick={toggleDropdown}
        className="
          flex items-center gap-2
          group
          transition-all duration-200
        "
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        
        {/* Avatar */}
        <img
          className="w-9 h-9 rounded-full object-cover border-2 border-gray-700 group-hover:border-gray-600 transition"
          src={currUser?.avatar}
          alt="user photo"
        />

        {/* Chevron indicator */}
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          id="dropdownAvatar"
          className={`
            absolute right-0 mt-3 z-50
            w-64
            rounded-2xl
            border shadow-2xl
            backdrop-blur-xl
            overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-200
            ${theme === "dark" 
              ? "bg-gradient-to-b from-gray-800 to-gray-900 border-white/10 shadow-black/50" 
              : "bg-white border-gray-200 shadow-gray-300/50"
            }
          `}
        >
          {/* User Info Section */}
          <div className={`px-4 py-4 border-b ${
            theme === "dark" ? "border-white/10" : "border-gray-200"
          }`}>
            <div className="flex items-center gap-3">
              <img
                className={`w-12 h-12 rounded-full object-cover border-2 ${
                  theme === "dark" ? "border-indigo-500/30" : "border-indigo-300"
                }`}
                src={currUser?.avatar}
                alt={currUser?.fullName}
              />
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm truncate ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {currUser?.fullName}
                </div>
                <div className={`text-xs truncate ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  {currUser?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="py-2">
            <li>
              <Link
                to={"/update-account"}
                onClick={() => setIsDropdownOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5
                  text-sm
                  transition-all duration-150
                  group
                  ${theme === "dark"
                    ? "text-gray-300 hover:bg-white/5 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <User size={18} className={`transition ${
                  theme === "dark" 
                    ? "text-gray-400 group-hover:text-indigo-400" 
                    : "text-gray-500 group-hover:text-indigo-600"
                }`} />
                <span>Update Details</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/change-password"}
                onClick={() => setIsDropdownOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5
                  text-sm
                  transition-all duration-150
                  group
                  ${theme === "dark"
                    ? "text-gray-300 hover:bg-white/5 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <KeyRound size={18} className={`transition ${
                  theme === "dark" 
                    ? "text-gray-400 group-hover:text-indigo-400" 
                    : "text-gray-500 group-hover:text-indigo-600"
                }`} />
                <span>Change Password</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
