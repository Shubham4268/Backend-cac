import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { handleApiError } from "../utils/errorHandler.js";
import { useDispatch } from "react-redux";
import { logout } from "../features/slices/authSlice.js";

const Navbar = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    setError(null);
    try {
      const loggedOutUser = await axios.post(
        "http://localhost:8000/api/v1/users/logout"
      );

      const { data: response } = loggedOutUser || {};
      const { success } = response || false;
      
      if (success) {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-52 bg-gray-800 text-white h-screen ">
        <div className="flex items-center justify-center p-4">
          <span className="text-2xl font-bold">Dashboard</span>
        </div>
        <nav className="mt-10 space-y-2">
          <Link to="/home">
            <NavItem label="Home" icon="🏠" />
          </Link>
          <Link to="/profile">
            <NavItem label="Your Profile" icon="👤" />
          </Link>
          <Link to="/addVideo">
            <NavItem label="Add a Video" icon="📹" />
          </Link>
          <Link to="/addTweet">
            <NavItem label="Add a Tweet" icon="➕" />
          </Link>
          <button className="w-full" onClick={logoutHandler}>
            <NavItem label="Logout" icon="🚪" />
          </button>
        </nav>
      </div>
      <div>
        {error && (
          <p className="mb-4 text-red-500 text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};

const NavItem = ({ label, icon }) => (
  <div className="flex items-center p-2 hover:bg-gray-700 cursor-pointer">
    <span className="text-xl">{icon}</span>
    <span className="ml-4">{label}</span>
  </div>
);

export default Navbar;
