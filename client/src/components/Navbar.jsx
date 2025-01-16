import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { handleApiError } from "../utils/errorHandler.js";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/slices/authSlice.js";
import { persistor } from "../app/store.js";
import { FcBusinessman, FcCamcorderPro, FcClapperboard, FcHome, FcIdea, FcImport, FcStart } from "react-icons/fc";

const Navbar = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return; // Exit if the user cancels
  
    setError(null);
    try {
      const loggedOutUser = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/logout`
      );
  
      const { data: response } = loggedOutUser || {};
      const { success } = response || false;
  
      if (success) {
        persistor.purge(); // Clears the persisted Redux state
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      handleApiError(error, setError);
    }
  };
  

  const currentUser = useSelector((state)=>state.user?.userData)
  const {loggedInUser} = currentUser || {}
  const {username} = loggedInUser || ""
  const homeIcon = <FcHome />
  const subscriptionIcon = <FcStart />
  const profileIcon = <FcBusinessman />
  const videoIcon = <FcClapperboard />

  const tweetIcon = <FcIdea />
  const logoutIcon = <FcImport />

  return (
    <div className="flex fixed max-h-full min-h-full overflow-auto no-scrollbar bg-gray-800 font-mono">
      {/* Sidebar */}
      <div className="w-36 md:w-52 sm:w-44 mt-14 text-white text-lg">
        <nav className="mt-6 space-y-2">
          <NavLinkItem to="/home" label="Home" icon={homeIcon}/>
          <NavLinkItem to="/subscription" label="Subscriptions" icon={subscriptionIcon}/>
          <NavLinkItem to={`/profile/${username}`} label="Your Profile" icon={profileIcon} />
          <NavLinkItem to="/addVideo" label="Add a Video" icon={videoIcon} />
          <NavLinkItem to="/addTweet" label="Add a Tweet" icon={tweetIcon} />
          <button className="w-full pb-10" onClick={logoutHandler}>
            <NavItem label="Logout" icon={logoutIcon} />
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

const NavLinkItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-2 cursor-pointer ${
        isActive ? "bg-gray-700 text-blue-400" : "hover:bg-gray-700"
      }`
    }
  >
    <span className="text-xl">{icon}</span>
    <span className="ml-4">{label}</span>
  </NavLink>
);

const NavItem = ({ label, icon }) => (
  <div className="flex items-center p-2 hover:bg-gray-700 cursor-pointer">
    <span className="text-xl">{icon}</span>
    <span className="ml-4">{label}</span>
  </div>
);

export default Navbar;
